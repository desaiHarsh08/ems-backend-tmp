import 'dotenv/config';
import { config } from 'dotenv';
import connectToDB from "./db/db.js";
import app from './app.js';

config({path: './config.env'});

const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT || 8000;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\nexam-management-backend is listening at http://localhost:${PORT}`);
        })
    })
    .catch((error) => {console.error(error)})