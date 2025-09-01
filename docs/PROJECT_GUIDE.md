# Guia geral do projeto

## Estrutura do projeto

- Todo código escrito da aplicação fica dentro da pasta `./src`
- A pasta `src/database` fica as configurações de serviços externos, como banco de dados e storage
- A pasta `rc/repositories` ficam os módulos dos repositórios, cada módulo tem um arquivo `I[nome_do_modulo]Repository.ts` que contém a interface de abstração do repositório
- Os mocks de cada interface de repositório ficam em `src/repositories/_mocks`, sempre que for utilizar um mock de repositório verificar nessa pasta se já existe um mock ou criar dentro dessa pasta
- Dentro da pasta `src/utils` tem as funções e classes de utilidades
- Dentro da pasta `src/core` contém a lógica principal da aplicação, a arquitetura está dividida em módulos e dentro de cada módulo possui uma pasta `src/core/[modulo]/controllers` (que contém os controllers do módulo), `src/core/[modulo]/models` (que contém as entidades e classes com a lógica principal do módulo) e `src/core/[modulo]/useCases` (que contém os casos de uso do módulo)
- Dentro de `src/core/shared` tem classes e funções comuns entre módulos, como classes de Design Patterns, utility classes e tiny classes

## Lançamento de erros

- Utilize a classe `ApiError` de `src/utils/ApiError.ts` ao lançar um novo erro, ao invés de lançar um `Error` padrão

## Trabalhando com datas

- Não utilize o `new Date` padrão, utilize a classe `DateTime` de `src/core/shared/Date.ts` para fazer transformações de data e hora e utilizar como tipagem de data em use cases e entities
- Não utilize o `DateTime` do Luxon diretamente, utilize sempre o `DateTime` de `src/core/shared/Date.ts`
- Sempre trabalhe com formato de string de data em DTOs. Exemplo: `'2025-05-05T10:00'`
- Não utilize timezones, a aplicação leva em conta apenas o horário literal (o horário que chega como string será sempre mantido o mesmo)
- Não é necessário passar os milissegundos, siga sempre o formato yyyy-MM-ddThh:mm

## Nomenclatura

- Criar todas as pastas e arquivos da aplicação utilizando o padrão camelCase. Exemplo: `exemploDeNome`

## Testes

- Utilize o padrão `[nome_do_teste].spec.ts` para indicar um teste

- Scripts

    - `npm run test`: Roda os testes da aplicação
    - `npm run test:watch`: Roda os testes de forma assistida
    - `npm run dev`: Roda a aplicação em localhost:8000