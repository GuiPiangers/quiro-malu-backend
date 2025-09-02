# Guia de Casos de Uso

## Localização
- Cada caso de uso deve estar em:  
  `src/repositories/[modulo]/NomeDoRepository.ts`

## Estrutura do Repositório

### Interface do Repositório

- Normalmente recebe um único objeto como parametro 
- Retorna as entidades instanciadas **entidades do módulo** (em `models`) nos métodos de busca

### Repositório

- Cada repositório é uma **classe** que:
  - Implementa a interface `I[nome_do_repositorio]Repository`.
  - Utiliza por padrão knex para comunicação com banco de dados relacional.
  - Não utiliza o objeto Date do JavaScript quando busca data, sempre deve ser convertido em string ou DateTime

## Exemplo (IBlockScheduleRepository)
```ts

  type BlockScheduleGetById = {
    id: string;
    userId: string;
  }
  interface IBlockScheduleRepository {
    findById(data: BlockScheduleGetById): Promise<BlockSchedule | null>

    save(data: BlockSchedule, userId: string): Promise<void>;
  }
```

## Exemplo (BlockSchedule)

```ts
export class BlockScheduleRepository implements IBlockScheduleRepository {
  async findById(id: string, userId: string): Promise<BlockSchedule | null> {
    const blockSchedulesDto: BlockScheduleDto | null = await Knex(
      ETableNames.BLOCK_SCHEDULES,
    )
      .select(
        "id",
        "userId",
        "description",
        Knex.raw(`DATE_FORMAT(startDate, '%Y-%m-%dT%H:%i') as date`),
        Knex.raw(`DATE_FORMAT(endDate, '%Y-%m-%dT%H:%i') as endDate`),
      )
      .first()
      .where({
        userId,
        id,
      });

    if (!blockSchedulesDto) return null;

    const date = new DateTime(blockSchedulesDto.date);
    const endDate = new DateTime(blockSchedulesDto.endDate);

    return new BlockSchedule({ ...blockSchedulesDto, date, endDate });
  }

  async save(
    { endDate, id, date: startDate, description }: BlockSchedule,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.BLOCK_SCHEDULES).insert({
      description,
      id,
      startDate: startDate.dateTime,
      endDate: endDate.dateTime,
      userId,
    });
  }
}
```

