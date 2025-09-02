
# Guia de Controllers

##  Como Criar um Controller

### 1. Nomeação e Localização
- **Arquivo**: `<NomeDoController>Controller/<NomeDoController>Controller.ts` para criação da classe do controller.
- **Arquivo Instanciação**: `<NomeDoController>Controller/index.ts` para instanciar as classes e exportar o objeto controller
- **Classe**: `NomeDoControllerController`.

### 2. Estrutura da Classe
- Deve receber no constructor uma classe de UseCase
- Deve ter um método `handle` que recebe como parametro um `request` e um `response` do express.
- O método handle deve:
  - Delegar para um caso de uso (`useCase.execute(...)`).
  - Tratar respostas com `response.status(...).json(...)`.
  - Encapsular erros com `try/catch` 
  - Enviar a response como um Objeto JSON.
  - Utilizar a função `responseError` de `src/utils/ResponseError.ts` para enviar uma resposta de erro padrão no catch do `try/catch`

**Exemplo de controller**
```ts
export class CreatePatientController {
  constructor(private createPatientUseCase: CreatePatientUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as PatientDTO;
      const userId = request.user.id;

      const res = await this.createPatientUseCase.execute(data, userId!);
      response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
```

### 3. Injeção de Dependências
- No `index.ts`, instancie o caso de uso (`new CreatePatientUseCase(repositoryInstance)`) e injete no controller.
- Exporte o controller **já instanciado**, por exemplo:

```ts
const patientRepository = new PatientRepository(patientRepository);
const createPatientUseCase = new CreatePatientUseCase(patientRepository);
const createPatientController = new CreatePatientController(createPatientUseCase);

export { createPatientController };
```

## Criando rota para o controller

- Todas as rotas são definidas em `src/router.ts`.
- Importe os controllers instanciados de cada módulo e use-os como handlers:
- As rotas seguem o padrão REST de nomenclatura e métodos

```ts
    import { createPatientController } from './core/patients/controllers';

    router.post('/patients', (req, res) =>
    createPatientController.create(req, res)
    );
 ```