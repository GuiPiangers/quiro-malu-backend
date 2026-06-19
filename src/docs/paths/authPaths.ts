import {
  CreateUserBodySchema,
  CreateUserResponseSchema,
} from '../../core/authentication/controllers/createUserController/createUserSchemas'
import {
  LoginBodySchema,
  LoginResponseSchema,
} from '../../core/authentication/controllers/loginUserController/loginSchemas'
import {
  LogoutBodySchema,
  LogoutResponseSchema,
} from '../../core/authentication/controllers/logout/logoutSchemas'
import {
  RefreshTokenBodySchema,
  RefreshTokenResponseSchema,
} from '../../core/authentication/controllers/refreshTokenController/refreshTokenSchemas'
import { GetUserProfileResponseSchema } from '../../core/authentication/controllers/getUserProfile/getUserProfileSchemas'
import {
  ResetPasswordBodySchema,
  ResetPasswordResponseSchema,
} from '../../core/authentication/controllers/resetPasswordController/resetPasswordSchemas'
import {
  SendResetPasswordTokenBodySchema,
  SendResetPasswordTokenResponseSchema,
} from '../../core/authentication/controllers/sendResetPasswordTokenController/sendResetPasswordTokenSchemas'
import { openApiRegistry } from '../registry'

const bearer = [{ bearerAuth: [] }]

/** Sessão e perfil: ordem pensada para teste no Swagger (cadastro → login → token → perfil). */
openApiRegistry.registerPath({
  method: 'post',
  path: '/register',
  tags: ['Auth'],
  summary: 'Cadastro de usuário',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserBodySchema,
          example: {
            name: 'Maria Silva',
            email: 'maria@exemplo.com',
            phone: '(51) 99999 9999',
            clinicId: '00000000-0000-4000-8000-000000000001',
            roleId: 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee',
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuário criado',
      content: {
        'application/json': { schema: CreateUserResponseSchema },
      },
    },
    400: {
      description:
        'Corpo inválido ou regra de negócio (ex.: email já cadastrado)',
    },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  summary:
    'Login (access + refresh token). Envie o header x-device-id para identificar o dispositivo nas rotas de refresh e logout.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginBodySchema,
          example: {
            email: 'eduardo@gmail.com',
            password: 'Senha123',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Autenticado',
      content: {
        'application/json': { schema: LoginResponseSchema },
      },
    },
    400: { description: 'Credenciais inválidas ou corpo inválido' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/logout',
  tags: ['Auth'],
  summary:
    'Encerra sessão do dispositivo atual (invalida refresh token). O fingerprint deve ser o mesmo do login (header x-device-id).',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LogoutBodySchema,
          example: {
            refreshTokenId: '00000000-0000-4000-8000-000000000001',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Logout realizado',
      content: {
        'application/json': { schema: LogoutResponseSchema },
      },
    },
    400: { description: 'Corpo inválido' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/refresh-token',
  tags: ['Auth'],
  summary:
    'Renova access token (rotação de refresh). O fingerprint do dispositivo deve ser o mesmo do login (header x-device-id).',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RefreshTokenBodySchema,
          example: {
            refreshTokenId: '00000000-0000-4000-8000-000000000001',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Novo access token e novo refresh token',
      content: {
        'application/json': { schema: RefreshTokenResponseSchema },
      },
    },
    400: { description: 'Corpo inválido' },
    401: {
      description: 'Refresh token inválido, expirado ou dispositivo incorreto',
    },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/reset-password',
  tags: ['Auth'],
  summary: 'Redefinição de senha',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetPasswordBodySchema,
          example: {
            token: 'a1b2c3d4...',
            password: 'NovaSenha123!',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Senha redefinida com sucesso',
      content: {
        'application/json': { schema: ResetPasswordResponseSchema },
      },
    },
    400: { description: 'Token inválido ou expirado, ou corpo inválido' },
  },
})

openApiRegistry.registerPath({
  method: 'post',
  path: '/send-reset-password-token',
  tags: ['Auth'],
  summary: 'Solicitação de e-mail com token para redefinir a senha',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SendResetPasswordTokenBodySchema,
          example: {
            email: 'usuario@exemplo.com',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'E-mail enviado com sucesso (ou ignorado caso o usuário não exista)',
      content: {
        'application/json': { schema: SendResetPasswordTokenResponseSchema },
      },
    },
    400: { description: 'Corpo inválido ou usuário não encontrado' },
  },
})

openApiRegistry.registerPath({
  method: 'get',
  path: '/profile',
  tags: ['Auth'],
  summary: 'Perfil do usuário autenticado',
  security: bearer,
  responses: {
    200: {
      description: 'Dados do usuário (sem senha)',
      content: {
        'application/json': { schema: GetUserProfileResponseSchema },
      },
    },
    401: {
      description: 'Não autenticado ou token sem identificação de usuário',
    },
    404: { description: 'Usuário não encontrado' },
  },
})
