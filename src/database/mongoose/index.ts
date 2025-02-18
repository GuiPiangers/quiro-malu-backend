import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE;

const MONGO_URI =
  isProduction && process.env.MONGO_ATLAS_URI
    ? process.env.MONGO_ATLAS_URI
    : `mongodb://localhost:27017/${MONGO_DATABASE}`;

export const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      authSource: isProduction ? undefined : "admin",
      user: isProduction ? undefined : process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: isProduction ? undefined : process.env.MONGO_INITDB_ROOT_PASSWORD,
    });

    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};
