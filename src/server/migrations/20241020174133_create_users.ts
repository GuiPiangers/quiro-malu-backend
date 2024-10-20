import { table } from "console";
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.string('')
    })
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.dropTable('users')
}

