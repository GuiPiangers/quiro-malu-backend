#!/usr/bin/env bash
set -euo pipefail

# ==========================
# Bootstrap Script
# ==========================
# Este script instala e configura o sistema de deploy automático
# - Instala o deploy.sh em /usr/local/bin/
# - Cria o serviço systemd
# - Configura permissões
# - Cria diretórios necessários

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==========================
# Funções de logging
# ==========================
log_info() {
    echo -e "${GREEN}[INFO]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

# ==========================
# Verificações iniciais
# ==========================
log_info "Iniciando bootstrap do sistema de deploy..."

# Verifica se está rodando como root
if [[ $EUID -ne 0 ]]; then
   log_error "Este script precisa ser executado como root (use sudo)"
   exit 1
fi

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verifica se docker compose está disponível
if ! docker compose version &> /dev/null; then
    log_error "Docker Compose não está disponível. Instale o Docker Compose v2."
    exit 1
fi

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    log_error "Node.js não está instalado. Instale o Node.js primeiro."
    exit 1
fi

# ==========================
# Configurações
# ==========================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SCRIPT=""
DEPLOY_SCRIPT_TARGET="/usr/local/bin/deploy.sh"
LOG_DIR="/var/log"
LOG_FILE="$LOG_DIR/deploy-agent.log"
SYSTEMD_SERVICE="/etc/systemd/system/deploy-webhook.service"

# Valores padrão (podem ser sobrescritos por argumentos)
DEPLOY_USER="${DEPLOY_USER:-deployuser}"
WORKING_DIR="${WORKING_DIR:-/app}"
PORT="${PORT:-3333}"

# ==========================
# Parse argumentos
# ==========================
while [[ $# -gt 0 ]]; do
  case "$1" in
    --user)
      DEPLOY_USER="$2"
      shift 2
      ;;
    --workdir)
      WORKING_DIR="$2"
      shift 2
      ;;
    --deploy-script)
      DEPLOY_SCRIPT="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --help)
      echo "Uso: $0 [opções]"
      echo ""
      echo "Opções:"
      echo "  --user USER            Usuário que irá rodar o serviço (padrão: deployuser)"
      echo "  --workdir DIR          Diretório de trabalho da aplicação (padrão: /app)"
      echo "  --deploy-script PATH   Caminho completo para o deploy.sh (padrão: <workdir>/deploy/deploy.sh)"
      echo "  --port PORT            Porta do webhook server (padrão: 3333)"
      echo "  --help                 Mostra esta mensagem"
      echo ""
      echo "Exemplo:"
      echo "  sudo ./bootstrap.sh --user myuser --workdir /opt/myapp --deploy-script /opt/myapp/deploy/deploy.sh"
      exit 0
      ;;
    *)
      log_error "Argumento desconhecido: $1"
      echo "Use --help para ver as opções disponíveis"
      exit 1
      ;;
  esac
done

# Define deploy script padrão se não foi passado
if [[ -z "$DEPLOY_SCRIPT" ]]; then
    DEPLOY_SCRIPT="$WORKING_DIR/deploy/deploy.sh"
    log_info "Usando deploy script padrão: $DEPLOY_SCRIPT"
fi

# ==========================
# 1. Instalar deploy.sh
# ==========================
log_info "Instalando deploy.sh..."

if [[ ! -f "$DEPLOY_SCRIPT" ]]; then
    log_error "Arquivo deploy.sh não encontrado em: $DEPLOY_SCRIPT"
    log_error "Certifique-se de que deploy.sh está no mesmo diretório que bootstrap.sh"
    exit 1
fi

cp "$DEPLOY_SCRIPT" "$DEPLOY_SCRIPT_TARGET"
chmod +x "$DEPLOY_SCRIPT_TARGET"
log_info "✓ deploy.sh instalado em $DEPLOY_SCRIPT_TARGET"

# ==========================
# 2. Criar diretório de logs
# ==========================
log_info "Configurando diretório de logs..."

if [[ ! -d "$LOG_DIR" ]]; then
    mkdir -p "$LOG_DIR"
fi

touch "$LOG_FILE"
chmod 666 "$LOG_FILE"
log_info "✓ Arquivo de log criado: $LOG_FILE"

# ==========================
# 3. Criar usuário se não existir
# ==========================
log_info "Verificando usuário $DEPLOY_USER..."

if ! id "$DEPLOY_USER" &>/dev/null; then
    log_info "Criando usuário $DEPLOY_USER..."
    useradd -r -s /bin/bash -d /home/$DEPLOY_USER -m $DEPLOY_USER
    log_info "✓ Usuário $DEPLOY_USER criado"
else
    log_info "✓ Usuário $DEPLOY_USER já existe"
fi

# Adicionar usuário ao grupo docker
if ! groups "$DEPLOY_USER" | grep -q docker; then
    usermod -aG docker "$DEPLOY_USER"
    log_info "✓ Usuário $DEPLOY_USER adicionado ao grupo docker"
fi

# ==========================
# 4. Criar diretório de trabalho
# ==========================
log_info "Configurando diretório de trabalho..."

if [[ ! -d "$WORKING_DIR" ]]; then
    log_warn "Diretório $WORKING_DIR não existe. Criando..."
    mkdir -p "$WORKING_DIR"
fi

chown -R "$DEPLOY_USER:$DEPLOY_USER" "$WORKING_DIR"
log_info "✓ Permissões do diretório $WORKING_DIR configuradas"

# ==========================
# Resumo final
# ==========================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "Bootstrap concluído com sucesso! ✓"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuração:"
echo "   Usuário: $DEPLOY_USER"
echo "   Diretório: $WORKING_DIR"
echo "   Deploy Script: $DEPLOY_SCRIPT_TARGET"
echo "   Porta: $PORT"
echo "   Log: $LOG_FILE"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Verificar/criar o arquivo .env em $WORKING_DIR:"
echo "   NODE_ENV=production"
echo "   PORT=$PORT"
echo "   DEPLOY_SECRET=<seu-secret>"
echo ""
echo "2. Compilar a aplicação (se ainda não compilou):"
echo "   cd $WORKING_DIR"
echo "   npm install"
echo "   npm run build"
echo ""
echo "⚠️  LEMBRE-SE:"
echo "   - Configure o .env com DEPLOY_SECRET antes de iniciar"
echo "   - O secret deve ser o mesmo usado no GitHub Actions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"