import { expect } from 'chai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import supertest from 'supertest';

dotenv.config();
const uriMongo = process.env.URIMONGO;

const requester = supertest('http://localhost:8000');

describe("Rutas de manejo de carritos", function () {
    let cartId;

    before(async () => {
        mongoose.connect(uriMongo)
            .then(() => { console.log("DB Connected"); })
            .catch((error) => { console.log(error); });
    });

    it("Ruta /api/carts POST", async () => {
        const mockCart = {
            user: new mongoose.Types.ObjectId(),
            products: []
        };

        const { statusCode, _body } = await requester.post("/api/carts").send(mockCart);

        cartId = _body[0]._id;

        expect(statusCode).to.be.equal(200);
        expect(_body[0]).to.have.property('_id');
    });

    it("Ruta /api/carts/:cid/product/:pid POST", async () => {

        const { statusCode, _body} = await requester.post(`/api/carts/${cartId}/product/67c8e30d318f865bb0420d88`)
        
        expect(statusCode).to.be.equal(200);
        expect(_body.products).to.have.lengthOf(1);
    });

    it("Ruta /api/carts/:cid PUT", async () => {
        const mockUpdate = {
            "quantity": 3
        };

        const { statusCode, _body } = await requester.put(`/api/carts/${cartId}/product/67c8e30d318f865bb0420d88`).send(mockUpdate);

        expect(statusCode).to.be.equal(200);
        expect(_body.products[0].quantity).to.equal(3);
    });

    it("Ruta /api/carts/:cid DELETE", async () => {
        const { statusCode } = await requester.delete(`/api/carts/${cartId}`);

        expect(statusCode).to.be.equal(200);
    });
});
