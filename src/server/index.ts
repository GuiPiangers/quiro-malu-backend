import knex from "knex";
import { development, production } from "./knex/knexfile";

const getEnvironment = () => {
    switch (process.env.NODE_ENV){
        case 'production': return production
        default: return development
    }
}

export const Knex = knex(getEnvironment()) 