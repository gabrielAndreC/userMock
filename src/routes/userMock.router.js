import { Router } from "express";
import { faker } from "@faker-js/faker";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";

const mockRouter = Router();

mockRouter.get("/usermock", async (req,res)=>{
    try {
        const users = []
        for (let i = 0; i < 50; i++) {
            users.push({
                name: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.number.int({min: 18, max: 100}),
                role: Math.random() < 0.50 ? "user" : "admin",
                cart: await cartModel.create({})
            })
        }
        const insert = await userModel.insertMany(users)
        res.status(200).send(insert)
    } catch (e) {
        res.status(500).send(e)
    }
})

export default mockRouter