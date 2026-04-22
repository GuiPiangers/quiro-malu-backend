# Guia de Casos de Uso

## Localização
- Cada caso de uso deve estar em:  
  `<módulo>/useCases/NomeDoUseCase.ts`

## Estrutura do Caso de Uso
- Cada caso de uso é uma **classe** com:
  - Construtor recebendo dependências (interfaces de repositório).
  - Método público `execute(dto: NomeDoDTO)` que executa o fluxo.
  - Uso de **entidades do módulo** (em `models`) para aplicar invariantes de domínio e montar objetos.
  - Uso de **repositórios** (em `src/repositories`) para persistência/consulta.
  - Retorno de uma entidade ou DTO de saída.

## Contrato de entrada (`execute`)
- O caso de uso **presume** que o DTO passado ao `execute` já está **correto em forma**: tipos esperados pelo TypeScript, campos obrigatórios presentes, strings já normalizadas quando aplicável.
- **Não** é responsabilidade do use case revalidar existência de campos ou fazer guardas redundantes (`typeof`, `!== undefined`, etc.) **só** porque os dados vieram da HTTP — isso fica no **controller** (ou camada de entrada equivalente).
- Continua válido aplicar **regras de negócio** no fluxo do use case (ex.: duplicidade, estado inválido, permissões) e instanciar **entidades / tiny types** que encodem invariantes de **domínio** (não confundir com validação de “request malformado”).

## Padrão a seguir
1. **Injeção de dependências** via interface do repositório.  
2. **Receber DTO de entrada** no método `execute`.  
3. **Instanciar entidade** do módulo (ex: `new Patient(...)`), em alguns casos também é possível receber a entidade já instanciada.  
4. **Aplicar regras de negócio** e, quando fizer sentido, delegar invariantes de domínio à entidade ou a tiny classes de `shared`.  
5. **Consultar repositório** quando necessário (ex: verificar duplicidade).  
6. **Persistir dados** usando o método adequado do repositório (`save`, `list`, etc.).  
7. **Retornar objeto de saída sempre como um DTO**.  

## Exemplo (CreatePatientUseCase)
```ts
export class CreatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<Patient> {
    const patient = new Patient(dto.name, dto.cpf, dto.birthDate);

    // Validações podem estar na entidade Patient
    const exists = await this.patientRepository.findByCPF(dto.cpf);
    if (exists) throw new AppError("Paciente já existe");

    return await this.patientRepository.save(patient);
  }
}
