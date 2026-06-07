export const SYSTEM_PERMISSIONS = [
  {
    key: 'patients:read',
    module: 'patients',
    action: 'read' as const,
    description: 'Consultar pacientes',
  },
  {
    key: 'patients:write',
    module: 'patients',
    action: 'write' as const,
    description: 'Criar e alterar pacientes',
  },
  {
    key: 'events:read',
    module: 'events',
    action: 'read' as const,
    description:
      'Consultar agendamentos, bloqueios de agenda, eventos e sugestões',
  },
  {
    key: 'events:write',
    module: 'events',
    action: 'write' as const,
    description:
      'Criar e alterar agendamentos, bloqueios de agenda e configuração de calendário',
  },
  {
    key: 'services:read',
    module: 'services',
    action: 'read' as const,
    description: 'Consultar serviços',
  },
  {
    key: 'services:write',
    module: 'services',
    action: 'write' as const,
    description: 'Criar e alterar serviços',
  },
  {
    key: 'finance:read',
    module: 'finance',
    action: 'read' as const,
    description: 'Consultar financeiro',
  },
  {
    key: 'finance:write',
    module: 'finance',
    action: 'write' as const,
    description: 'Criar e alterar financeiro',
  },
  {
    key: 'messages:read',
    module: 'messages',
    action: 'read' as const,
    description: 'Consultar mensagens e estratégias',
  },
  {
    key: 'messages:write',
    module: 'messages',
    action: 'write' as const,
    description: 'Configurar mensagens e estratégias',
  },
  {
    key: 'message_logs:read',
    module: 'message_logs',
    action: 'read' as const,
    description: 'Consultar logs de WhatsApp',
  },
  {
    key: 'users:read',
    module: 'users',
    action: 'read' as const,
    description: 'Consultar usuários, papéis e permissões',
  },
  {
    key: 'users:write',
    module: 'users',
    action: 'write' as const,
    description: 'Gerenciar usuários, papéis e permissões',
  },
] as const

export type PermissionKey = (typeof SYSTEM_PERMISSIONS)[number]['key']
