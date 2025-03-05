import mockRouter from './routes/userMock.router.js';
import indexRouter from './routes/index.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import accountRouter from './routes/account.router.js';

import express from 'express'
import session from 'express-session';

import dotenv from 'dotenv'
import mongoose from 'mongoose';
import handlebars from "express-handlebars"
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import {iniPassport} from './config/passport.js';

import cluster from 'cluster'
import { cpus } from 'os';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const swaggerOptions = {
    definition:{
        openapi: "3.1.0",
        info: {
            title: "Documentacion de la api",
            description: "Api ecommerce"
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);

dotenv.config();

const uriMongo = process.env.URIMONGO;

mongoose.connect(uriMongo);

const app = express()

if (cluster.isPrimary){
    console.log("proceso primario")
    const httpServer = app.listen(8000, ()=>{console.log("puerto 8000")});
    /*for(let i = 0; i < cpus().length; i++){
        cluster.fork()
    }*/
   cluster.fork()
}

else{
    console.log("proceso worker")
    const httpServer = app.listen(5000, ()=>{console.log("puerto 5000")});
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.SECRETCOOKIE));

iniPassport();
app.use(session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use('/',indexRouter);
app.use('/api/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs))
app.use('/account',accountRouter);
app.use('/api/mocks/', mockRouter)
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);