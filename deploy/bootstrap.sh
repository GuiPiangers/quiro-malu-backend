#!/usr/bin/env bash
set -euo pipefail

# ==========================
# Bootstrap Script - Docker Version
# ==========================
# Prepara o ambiente para deploy via Docker
# - Instala deploy.sh no host
# - Cria arquivo de log
# - Cria volume Docker

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ==========================
# Verificações
# ==========================
log_info "Iniciando bootstrap do sistema de deploy..."

if [[ $EUID -ne 0 ]]; then
   log_error "Execute como root (use sudo)"
   exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    log_error "Docker Compose v2 não está disponível"
    exit 1
fi

# ==========================
# Configurações
# ==========================
DEPLOY_SCRIPT="${1:-./deploy/deploy.sh}"
DEPLOY_SCRIPT_TARGET="/usr/local/bin/deploy.sh"
LOG_FILE="/var/log/deploy-agent.log"

# ==========================
# 1. Instalar deploy.sh
# ==========================
log_info "Instalando deploy.sh no host..."

if [[ ! -f "$DEPLOY_SCRIPT" ]]; then
    log_error "deploy.sh não encontrado: $DEPLOY_SCRIPT"
    log_error "Uso: sudo ./bootstrap.sh [caminho/para/deploy.sh]"
    log_error "Exemplo: sudo ./bootstrap.sh ./deploy/deploy.sh"
    exit 1
fi

cp "$DEPLOY_SCRIPT" "$DEPLOY_SCRIPT_TARGET"
chmod +x "$DEPLOY_SCRIPT_TARGET"
log_info "✓ deploy.sh instalado em $DEPLOY_SCRIPT_TARGET"

# ==========================
# 2. Criar arquivo de log
# ==========================
log_info "Criando arquivo de log..."

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"
chmod 666 "$LOG_FILE"
# Garante que o arquivo exista antes do Docker subir
if [[ ! -f "$LOG_FILE" ]]; then
    log_warn "Falha ao criar arquivo de log: $LOG_FILE"
fi
log_info "✓ Log criado: $LOG_FILE"

# ==========================
# 3. Criar volume Docker
# ==========================
log_info "Criando volume Docker para logs..."

if docker volume inspect deploy-logs &>/dev/null; then
    log_info "✓ Volume deploy-logs já existe"
else
    docker volume create deploy-logs
    log_info "✓ Volume deploy-logs criado"
fi

# ==========================
# 4. Verificar arquivos necessários
# ==========================
log_info "Verificando arquivos necessários..."

WARNINGS=0

if [[ ! -f ".env" ]]; then
    log_warn "Arquivo .env não encontrado"
    WARNINGS=$((WARNINGS + 1))
fi

if [[ ! -f "docker-compose.prod.yml" ]]; then
    log_warn "Arquivo docker-compose.prod.yml não encontrado"
    WARNINGS=$((WARNINGS + 1))
fi

if [[ ! -f "Dockerfile.deploy" ]]; then
    log_warn "Arquivo Dockerfile.deploy não encontrado"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar DEPLOY_SECRET no .env
if [[ -f ".env" ]]; then
    if ! grep -q "DEPLOY_SECRET=" .env; then
        log_warn "DEPLOY_SECRET não encontrado no .env"
        WARNINGS=$((WARNINGS + 1))
    else
        log_info "✓ DEPLOY_SECRET encontrado no .env"
    fi
fi

# ==========================
# 5. Detectar e salvar DOCKER_GID
# ==========================
log_info "Detectando GID do grupo docker..."

DOCKER_GID=$(getent group docker | cut -d: -f3)

if [[ -z "$DOCKER_GID" ]]; then
    log_error "Grupo docker não encontrado. Docker está instalado?"
    exit 1
fi

# Atualiza ou adiciona no .env
if grep -q "^DOCKER_GID=" .env 2>/dev/null; then
    sed -i "s/^DOCKER_GID=.*/DOCKER_GID=$DOCKER_GID/" .env
else
    echo "DOCKER_GID=$DOCKER_GID" >> .env
fi

log_info "✓ DOCKER_GID=$DOCKER_GID salvo no .env"

# ==========================
# Resumo final
# ==========================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $WARNINGS -eq 0 ]]; then
    log_info "Bootstrap concluído com sucesso! ✓"
else
    log_warn "Bootstrap concluído com $WARNINGS avisos"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Arquivos instalados:"
echo "   deploy.sh: $DEPLOY_SCRIPT_TARGET"
echo "   Log: $LOG_FILE"
echo "   Volume: deploy-logs"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Verificar .env (DEPLOY_SECRET configurado?)"
if [[ ! -f ".env" ]] || ! grep -q "DEPLOY_SECRET=" .env 2>/dev/null; then
    echo "   echo 'DEPLOY_SECRET=$(openssl rand -hex 32)' >> .env"
fi
echo ""
echo "2. Build da imagem do webhook:"
echo "   docker compose -f docker-compose.prod.yml build deploy-webhook"
echo ""
echo "3. Iniciar todos os serviços:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "4. Verificar status:"
echo "   docker compose -f docker-compose.prod.yml ps"
echo "   curl http://localhost:3333/health"
echo ""
echo "5. Ver logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f deploy-webhook"
echo "   tail -f $LOG_FILE"
echo ""

if [[ $WARNINGS -gt 0 ]]; then
    echo "⚠️  Resolva os avisos acima antes de continuar"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"