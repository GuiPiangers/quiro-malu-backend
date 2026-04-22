# Guia de Entidades

As entidades são classes com que encapsulam a lógica principal do módulo.

## Localização
- Cada entidade deve estar em:  
  `src/core/<módulo>/models/NomeDaEntidade.ts`

## Estrutura da entidade
- Cada entidade é uma **classe** com:
  - Construtor recebendo um objeto DTO que representa a entidade sem as funcionalidades.
  - Um método getDTO que retorna um objeto DTO da classe.
- A classe deve ser uma extensão da classe Entity de `src/core/shared/Entity.ts`: `extends Entity`
- Quando possível devem utilizar classes TinyTypes de `src/core/shared` para encapsular lógicas comuns

## Contrato de entrada (construtor / DTO)
- O construtor **presume** que o objeto recebido já foi validado no **controller** quanto a **obrigatoriedade de campos** e **forma** compatível com o DTO (tipos esperados pelo TypeScript).
- **Evite** checagens defensivas redundantes (`typeof`, presença de campo) **apenas** para compensar request HTTP malformado; isso é responsabilidade da camada de entrada.
- Mantenha validações que expressam **regras do domínio** (limites, formatos de negócio, combinações inválidas), em geral via **tiny types** ou lógica da própria entidade.

## Exemplo
```ts
export type ExamDTO = {
  id?: string;
  patientId: string;
  fileName: string;
  fileSize?: number;
};

export class Exam extends Entity {
  readonly patientId: string;
  readonly fileName: string;
  readonly fileSize?: number;

  constructor({ fileName, patientId, fileSize, id }: ExamDTO) {
    super(id);
    this.patientId = patientId;
    this.fileName = fileName;
    this.fileSize = fileSize;
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      fileName: this.fileName,
      fileSize: this.fileSize,
    };
  }
}

