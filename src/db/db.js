import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB =  async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        console.log(`\nDatabase connected successfully...!\nDB_HOST: ${connectionInstance.connection.host}\nDB_PORT: ${connectionInstance.connection.port}`);
    } catch (error) {
        console.error("MongoDB connection failed...\nERROR: ", error);
    }
}

export default connectToDB;