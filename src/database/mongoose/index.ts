import mongoose from "mongoose";

const HOST = process.env.DB_HOST ?? "localhost";
const MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE;
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

export const mongoConnect = async () =>
  mongoose
    .connect(`mongodb://${HOST}/${MONGO_DATABASE}`, {
      authSource: "admin",
      user: MONGO_USER,
      pass: MONGO_PASSWORD,
    })
    .then(() => console.log("mongoDb conectado com sucesso!"));
