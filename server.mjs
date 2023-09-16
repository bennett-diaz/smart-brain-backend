import express, { response } from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt-nodejs';
import handleRegister from './controllers/register.mjs';
import handleSignin from './controllers/signin.mjs';
import handleProfile from './controllers/profile.mjs';
import {handleImage, handleFaceBox} from './controllers/image.mjs';
import cors from 'cors';
import knex from 'knex';
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT


const app = express();
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'smart-brain'
    }
});

app.use(cors());
app.use(bodyParser.json());


app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) });

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

app.put('/image', (req, res) => { handleImage(req, res, db) });

app.post('/clarifai', (req, res) => { handleFaceBox(req, res) });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});