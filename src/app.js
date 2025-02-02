import mockRouter from './routes/userMock.router.js';
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();

const uriMongo = process.env.URIMONGO;

mongoose.connect(uriMongo);

const app = express()

const httpServer = app.listen(8080, ()=>{console.log("puerto 8080")});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/mocks/', mockRouter)