import { expect } from 'chai'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import supertest from 'supertest'
import __dirname from '../../src/utils.js'

dotenv.config();
const uriMongo = process.env.URIMONGO;

const requester = supertest('http://localhost:8000')

describe("Rutas de manejo de productos", function(){
    let productId;

    before(async ()=>{
        mongoose.connect(uriMongo)
        .then(()=> {console.log("DB Connected")})
        .catch((error) =>{console.log(error)})
    })
    

    it("Ruta api/products/ GET", async ()=>{

        const {statusCode} = await requester.get('/api/products')

        expect(statusCode).to.be.equal(200)
    })

    it("Ruta api/products POST", async ()=>{
        const mockProduct = {
            name: "Vaso",
            categ: "Vasos",
            desc: "Vaso de vidrio",
            price: 40,
            stock: 100
        }
        const {statusCode, _body} = await requester.post("/api/products").send(mockProduct)
        productId = _body._id
        expect(statusCode).to.be.equal(201)
    })

    it("Ruta api/products/:pid PUT", async ()=>{
        const mockProduct = {
            price: 60
        }
        const {_body} = await requester.put(`/api/products/${productId}`).send(mockProduct)

        expect(_body.price).to.be.equal(60)
    })

    it("Ruta api/products/:pid DELETE", async ()=>{
        const {statusCode} = await requester.delete(`/api/products/${productId}`)

        expect(statusCode).to.be.equal(200)
    })
})