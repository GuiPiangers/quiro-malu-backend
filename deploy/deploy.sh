#!/usr/bin/env bash
set -euo pipefail

# ==========================
# Configuration
# ==========================
COMPOSE_FILE=""
SERVICES=()
LOG="/var/log/deploy-agent.log"
IMAGE=""
TAG=""
ROLLBACK_TAG="previous"
ENV_FILE="${ENV_FILE:-/app/.env}"

# ==========================
# Logging functions
# ==========================
log() {
    echo "$(date "+%Y-%m-%dT%H:%M:%S%z") - $*" | tee -a "$LOG"
}

log_error() {
    echo "$(date "+%Y-%m-%dT%H:%M:%S%z") - ERROR: $*" | tee -a "$LOG" >&2
}

# ==========================

# ==========================
# Args parsing
# ==========================
while [[ $# -gt 0 ]]; do
  case "$1" in
    --image)
      IMAGE="$2"
      shift 2
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    --compose-file)
      COMPOSE_FILE="$2"
      shift 2
      ;;
    --service)
      SERVICES+=("$2")
      shift 2
      ;;
    *)
      log_error "Unknown argument: $1"
      exit 1
      ;;
  esac
done

# ==========================
# Docker Login
# ==========================
if [[ -n "${DOCKER_USERNAME:-}" ]] && [[ -n "${DOCKER_PASSWORD:-}" ]]; then
    log "Logging into Docker Hub..."
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin || log_error "Failed to login to Docker Hub"
else
    # Check for logs warning function or just rely on log
    if declare -f log_warn > /dev/null; then
        log_warn "DOCKER_USERNAME or DOCKER_PASSWORD not set. Skipping docker login."
    else
        log "WARNING: DOCKER_USERNAME or DOCKER_PASSWORD not set. Skipping docker login."
    fi
fi

# ==========================
# Validation
# ==========================
if [[ -z "$IMAGE" ]]; then
  log_error "--image is required"
  exit 1
fi

if [[ -z "$TAG" ]]; then
  log_error "--tag is required"
  exit 1
fi

if [[ -z "$COMPOSE_FILE" ]]; then
  log_error "--compose-file is required"
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  log_error "Compose file not found: $COMPOSE_FILE"
  exit 1
fi

if [[ ${#SERVICES[@]} -eq 0 ]]; then
  log_error "At least one --service is required"
  exit 1
fi

# ==========================
# Backup current version
# ==========================
log "Starting deploy: $IMAGE:$TAG"
log "Compose file: $COMPOSE_FILE"
log "Services: ${SERVICES[*]}"

# Salva a tag atual como backup ANTES de fazer qualquer mudança
log "Backing up current version as $IMAGE:$ROLLBACK_TAG"
if docker image inspect "$IMAGE:latest" &>/dev/null; then
    docker tag "$IMAGE:latest" "$IMAGE:$ROLLBACK_TAG" 2>&1 | tee -a "$LOG" || {
        log_error "Failed to backup current version"
        exit 1
    }
else
    log "No previous version found (first deploy)"
fi

# ==========================
# Deploy new version
# ==========================
log "Pulling new image: $IMAGE:$TAG"
if ! docker pull "$IMAGE:$TAG" 2>&1 | tee -a "$LOG"; then
    log_error "Failed to pull image $IMAGE:$TAG"
    exit 1
fi

log "Tagging new version as latest"
docker tag "$IMAGE:$TAG" "$IMAGE:latest" 2>&1 | tee -a "$LOG"

# Pull compose services
log "Pulling compose services"
for svc in "${SERVICES[@]}"; do
  log "Pulling service: $svc"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull "$svc" 2>&1 | tee -a "$LOG" || {
      log "Warning: Failed to pull $svc (might not use the image we just pulled)"
  }
done

# Restart services with new version
log "Starting services: ${SERVICES[*]}"
if ! docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps --remove-orphans "${SERVICES[@]}" 2>&1 | tee -a "$LOG"; then
    log_error "Failed to start services"
    log "Attempting rollback..."
    rollback
    exit 1
fi

# ==========================
# Healthcheck function
# ==========================
check_health() {
    local svc=$1
    local cid
    
    cid=$(docker compose -f "$COMPOSE_FILE" ps -q "$svc" 2>/dev/null || true)
    
    if [[ -z "$cid" ]]; then
        log "Service $svc: container not found"
        return 1
    fi
    
    # Verifica se o container está rodando
    local state
    state=$(docker inspect --format='{{.State.Status}}' "$cid" 2>/dev/null || echo "unknown")
    
    if [[ "$state" != "running" ]]; then
        log "Service $svc: not running (state: $state)"
        return 1
    fi
    
    # Se tem healthcheck, verifica
    local health
    health=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$cid" 2>/dev/null || echo "unknown")
    
    if [[ "$health" == "no-healthcheck" ]]; then
        log "Service $svc: running (no healthcheck configured)"
        return 0
    fi
    
    log "Service $svc: health status = $health"
    
    if [[ "$health" == "healthy" ]]; then
        return 0
    fi
    
    return 1
}

# ==========================
# Rollback function
# ==========================
rollback() {
    log "=== STARTING ROLLBACK ==="
    
    if ! docker image inspect "$IMAGE:$ROLLBACK_TAG" &>/dev/null; then
        log_error "No rollback image available"
        return 1
    fi
    
    log "Rolling back to: $IMAGE:$ROLLBACK_TAG"
    docker tag "$IMAGE:$ROLLBACK_TAG" "$IMAGE:latest" 2>&1 | tee -a "$LOG"
    
    for svc in "${SERVICES[@]}"; do
        docker compose -f "$COMPOSE_FILE" pull "$svc" 2>&1 | tee -a "$LOG" || true
    done
    
    docker compose -f "$COMPOSE_FILE" up -d --no-deps --remove-orphans "${SERVICES[@]}" 2>&1 | tee -a "$LOG" || {
        log_error "Rollback failed!"
        return 1
    }
    
    log "Rollback completed"
    return 0
}

# ==========================
# Health verification loop
# ==========================
log "Starting health verification (60 seconds max)"

for i in {1..12}; do
    log "Health check attempt $i/12"
    ALL_HEALTHY=true
    
    for svc in "${SERVICES[@]}"; do
        if ! check_health "$svc"; then
            ALL_HEALTHY=false
        fi
    done
    
    if [[ "$ALL_HEALTHY" == "true" ]]; then
        log "✅ All services are healthy!"
        log "Deploy completed successfully"
        
        # Cleanup: remove old backup
        if docker image inspect "$IMAGE:$ROLLBACK_TAG" &>/dev/null; then
            log "Cleaning up old backup image"
            docker rmi "$IMAGE:$ROLLBACK_TAG" 2>&1 | tee -a "$LOG" || true
        fi
        
        exit 0
    fi
    
    if [[ $i -lt 12 ]]; then
        log "Waiting 5 seconds before next check..."
        sleep 5
    fi
done

# ==========================
# Deploy failed - Rollback
# ==========================
log_error "Health checks failed after 60 seconds"
log "Initiating rollback..."

if rollback; then
    log_error "Deploy failed but rollback succeeded"
    exit 1
else
    log_error "Deploy failed and rollback also failed - manual intervention required!"
    exit 2
fi
if [[ -n "$ENV_FILE" ]] && [[ ! -f "$ENV_FILE" ]]; then
  log_error "Env file not found: $ENV_FILE"
  exit 1
fi
