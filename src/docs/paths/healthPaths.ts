import { HealthResponseSchema } from '../../schemas/healthSchemas'
import { openApiRegistry } from '../registry'

openApiRegistry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Health check',
  responses: {
    200: {
      description: 'API em execução',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
})
