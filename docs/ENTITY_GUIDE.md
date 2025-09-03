# Guia de Entidades

As entidades são classes com que encapsulam a lógica principal do módulo.

## Localização
- Cada entidade deve estar em:  
  `src/core/<módulo>/models/NomeDaEntidade.ts`

## Estrutura do Entidade
- Cada caso de uso é uma **classe** com:
  - Construtor recebendo um objeto DTO que representa a entidade sem as funcionalidades.
  - Um método getDTO que retorna um objeto DTO da classe.
- A classe deve ser uma extensão da classe Entity de `src/core/shared/Entity.ts`: `extends Entity`
- Quando possível devem utilizar classes TinyTypes de `src/core/shared` para encapsular lógicas comuns

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

