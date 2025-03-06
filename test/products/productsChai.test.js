import { expect }from 'chai'
import mongoose from 'mongoose'
import { productDao } from '../../src/models/dao/product.dao.js'
import dotenv from 'dotenv'
import { describe } from 'mocha';

dotenv.config();
const uriMongo = process.env.URIMONGO;
mongoose.connect(uriMongo)
.then(()=> {console.log("DB Connected")})
.catch((error) =>{console.log(error)})

describe('Testing products', async()=>{

    let productId;

    it('Crear un producto', async function(){
        const mockProduct = {
            name: "Vaso",
            categ: "Vasos",
            desc: "Vaso de vidrio",
            price: 40,
            stock: 100
        }

        const newProduct = await productDao.create(mockProduct)
        productId = newProduct._id
        expect(newProduct).to.have.property("price")
    })

    it('Obtener todos los productos', async function(){
        const products = await productDao.getAll()
        expect(Array.isArray(products)).to.be.ok
    })
        
    it('Obtener un producto', async function(){
        const product = await productDao.findById(productId)
        
        expect(product).to.be.a('object')
    })
        
    it('Actualizar un producto', async function(){
        const mockProduct = {
            price: 60
            }
            const productUpdate = await productDao.findByIdAndUpdate(productId, mockProduct)
            
            const product = await productDao.findById(productId)

            expect(product.price).to.equal(60)
        })

    it('Eliminar un producto', async function(){
        const deleteProduct = await productDao.deleteOne(productId)
        const product = await productDao.findById(productId)
        
        expect(product).to.be.a("null")
    })
})