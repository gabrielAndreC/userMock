import { expect } from 'chai'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import supertest from 'supertest'
import __dirname from '../../src/utils.js'
import crypto from 'crypto'

dotenv.config();
const uriMongo = process.env.URIMONGO;

const requester = supertest('http://localhost:8000')

describe("Rutas de sesion de account", function(){
    let user = {};
    let cookie = {};

    before(async ()=>{
        mongoose.connect(uriMongo)
        .then(()=> {console.log("DB Connected")})
        .catch((error) =>{console.log(error)})
    })
    

    it("Ruta account/register POST", async ()=>{
        const newUser = {
            name: "Super",
            lastName: "Perez",
            email: `superperez${crypto.randomBytes(5).toString('hex')}@gmail.com`,
            password: "coder",
            age: 20,
            role: "user"
        }
        
        const {statusCode, request} = await requester.post('/account/register').send(newUser)
        user = request._data

        expect(statusCode).to.be.equal(201)
    })

    it("Ruta account/login POST", async ()=>{
        const result = await requester.post('/account/login').send(user)
        const cookieResult = result.headers["set-cookie"][0]
        cookie = {
           name: cookieResult.split("=")[0],
           value: cookieResult.split("=")[1]
        }
        expect(cookie.name).to.be.ok.and.equal("token")
        expect(cookie.value).to.be.ok
    })

    it("Ruta accout/current GET", async ()=>{
        const {_body} = await requester.get('/account/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(_body.payload.email).to.be.equal(user.email)
        expect(true).to.be.ok;
    })
})