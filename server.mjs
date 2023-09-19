import express, { response } from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt-nodejs';
import handleRegister from './controllers/register.mjs';
import handleSignin from './controllers/signin.mjs';
import handleProfile from './controllers/profile.mjs';
import { handleImage, handleFaceBox, test } from './controllers/image.mjs';
import cors from 'cors';
import knex from 'knex';
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT


const app = express();
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DB_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
        // client: 'pg',
        // connection: {
        //     host: 'dpg-ck4scjgj9kis73d4iph0-a',
        //     port: 5432,
        //     user: 'smart_brain_db_ojcy_user',
        //     password: 'MamQYfaM0nh7wFubvXoGDNtSL6AtrZAE',
        //     database: 'smart_brain_db_ojcy'
    }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) });

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

app.put('/image', (req, res) => { handleImage(req, res, db) });

app.post('/clarifai', (req, res) => { handleFaceBox(req, res) });

app.get('/test', (req, res) => { test(req, res, db) });


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});