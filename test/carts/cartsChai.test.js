import { expect } from 'chai';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";
import { cartDao } from '../../src/models/dao/cart.dao.js';
import { productDao } from '../../src/models/dao/product.dao.js';
import dotenv from 'dotenv';
import { describe } from 'mocha';

dotenv.config();
const uriMongo = process.env.URIMONGO;
mongoose.connect(uriMongo)
    .then(() => { console.log("DB Connected") })
    .catch((error) => { console.log(error) });

describe('Testing Carts', async () => {

    let cartId;
    let productId;

    it('Crear un carrito', async function () {
        // Crear un producto primero
        const mockProduct = {
            name: "Vaso",
            categ: "Vasos",
            desc: "Vaso de vidrio",
            price: 40,
            stock: 100
        };

        const newProduct = await productDao.create(mockProduct);
        productId = newProduct._id;

        // Crear un carrito vacío
        const mockCart = {
            user: new mongoose.Types.ObjectId(),
            products: []
        };

        const newCart = await cartDao.create(mockCart);
        cartId = newCart._id;

        expect(newCart).to.have.property("_id");
    });

    it('Obtener un carrito', async function () {
        const cart = await cartDao.findOne(cartId);
        expect(cart).to.be.a('object');
    });

    it('Agregar producto al carrito', async function () {
        let cart = await cartDao.findOne(cartId);
    
        await cart.products.push({"product": productId,"quantity":10})
        await cart.save();
        
        cart = await cartDao.findOne(cartId);
        
        expect(cart.products).to.have.lengthOf(1);
        expect(cart.products[0].product.toString()).to.equal(productId.toString());
        expect(cart.products[0].quantity).to.equal(10);
    });
    

    it('Eliminar producto del carrito', async function () {
        const updatedCart = await cartDao.deleteCartProduct(cartId, productId);

        const cart = await cartDao.findOne(cartId);
        expect(cart.products[0]).to.be.equal(undefined);
    });

    it('Eliminar un carrito', async function () {
        const deleteCart = await cartDao.deleteById(cartId);
        const cart = await cartDao.findOne(cartId);
        expect(cart).to.be.null;
    });
});
