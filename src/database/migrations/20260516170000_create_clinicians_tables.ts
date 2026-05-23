import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  const hasClinicians = await knex.schema.hasTable(ETableNames.CLINICIANS)
  if (!hasClinicians) {
    await knex.schema.createTable(ETableNames.CLINICIANS, (table) => {
      table.string('id', 100).primary().index()
      table
        .foreign('id')
        .references('id')
        .inTable(ETableNames.USERS)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamps(true, true)
    })
  }

  const hasCs = await knex.schema.hasTable(ETableNames.CLINICIAN_SERVICES)
  if (!hasCs) {
    await knex.schema.createTable(ETableNames.CLINICIAN_SERVICES, (table) => {
      table.string('id', 100).primary().index()
      table
        .string('clinicianId', 100)
        .notNullable()
        .index()
        .references('id')
        .inTable(ETableNames.CLINICIANS)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .string('serviceId', 100)
        .notNullable()
        .index()
        .references('id')
        .inTable(ETableNames.SERVICES)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.unique(['clinicianId', 'serviceId'])
      table.timestamps(true, true)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ETableNames.CLINICIAN_SERVICES)
  await knex.schema.dropTableIfExists(ETableNames.CLINICIANS)
}
