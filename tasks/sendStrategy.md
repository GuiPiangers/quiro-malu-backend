# Tasks — Implementar `sendStrategy`

## Contexto
Vamos criar multiplas estratégias para personalizar os patients que irão receber a mensagem. Para isso será utilizado o padrão strategy para adicionar uma validação se a mensagem poderá ser enviada ou não.

Deverá ser possível criar multiplas configurações de estratégias e essas estratégias podem ser associadas a multiplos SendMessageUseCases como `sendBirthdayMessageUseCase`, `sendBeforeScheduleMessageUseCase` e `sendAfterScheduleMessageUseCase`

Cada estratégia poderá ter sua lógica própria, assim como ter em seu constructor injetado repositories e outras dependencias diferentes em cada uma delas 

Estratégias que serão implementadas:

### SendMostRecentPatientsStrategy: Envia a mensagem apenas para os pacientes mais recentes (Que foram cadastrados por último)

**Parametros configuráveis:**

amount: number //define qual a quantidade de pacientes mais recentes podem receber a mensagem (Ex.: 20 mais recentes). O limite deve ser 50

### SendMostFrequencyPatientsStrategy: Envia a mensagem apenas para os pacientes com mais agendamentos

**Parametros configuráveis:**

amount: number //define qual a quantidade de pacientes com mais agendamentos que podem receber a mensagem (Ex.: 20 com mais agendamentos). O limite deve ser 50

### SendSelectedListStrategy: Envia a mensagem apenas para os pacientes que estão na lista configurada

**Parametros configuráveis:**

patientIdList: string[] // Lista de ids dos pacientes que poderão receber a mensagem

### ExcludePatientsListStrategy: Envia a mensagem para todos os pacientes, exceto os que estão na lista configurada

**Parametros configuráveis:**

patientIdList: string[] // Lista de ids dos pacientes que não poderão receber a mensagem

## Objetivo

- Criar multiplas estratégias configuráveis
- Salvar as estratégias configuradas pelo cliente em um banco de dados
- Possibilitar a associação de estratégias com os useCases de envio de mensagem (Essa associação deve permanecer salva)


