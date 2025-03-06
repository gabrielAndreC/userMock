import { userService } from "../services/user.service.js";
import { cartService } from "../services/carts.service.js"
import { faker } from "@faker-js/faker";
import { checkHashed, createToken, verifyToken } from "../utils.js";

export class AccountController{
    async mockRegister(req,res){
        try {
            const users = []
            
            let quantity = 1;
            
            req.query.quantity ? quantity = req.query.quantity : quantity = 10
            
            for (let i = 0; i < quantity; i++) {
                users.push({
                    name: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    age: faker.number.int({min: 18, max: 100}),
                    role: Math.random() < 0.50 ? "user" : "admin",
                    cart: await cartService.create()
                })
            }
            const insert = await userService.createMany(users)
            res.status(200).json(insert)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async register(req,res){
        try {
            res.status(201).json({status: "success", msg: "Usuario registrado"})
        } catch (error) {
            console.log(error);
            res.status(501).json({status: "error", msg: "error interno del servidor"})
        }
    }

    async login(req,res){
        const user = await userService.findOneLean({email: req.body.email.toLowerCase()})

        if (!user || !user.password){
            return res.render("login",{style:"main.css",msg:"Credenciales incorrectas"})
        }

        if (checkHashed(req.body.password, user.password)){
            const token = createToken(user);

            res.cookie("token",token, {httpOnly: true});
            res.locals.userLogged = user.email;
            res.render("home",{style:"main.css"})
        }
        else{
            res.render("login",{style:"main.css"})
        }
    }

    async passportGoogleAuth(req,res){
        const user = await userService.findOneLean({email: req.user.email.toLowerCase()})
        
        const token = createToken(user);

        res.cookie("token",token, {httpOnly: true});

        res.redirect("/")
    }

    async auth(req,res){
        const {email,password} = req.body;

        const user = await userService.findOne({email: email})

        if (!user || !checkHashed(password,user.password)){
             return res.status(401).json({status: "error", msg:"Credenciales incorrectas"})
        }

        const token = createToken(user);

        res.cookie("token",token, {httpOnly: true});

        res.status(200).json({status:"succes", payload: token})
    }

    async getCurrent(req,res){
        try {
        const token = req.cookies.token;

        const validToken = verifyToken(token);
        
        if (!validToken) return res.status(401).json({status:"error", msg: "Token no valido/vencido"})
        
        res.status(200).json({status:"success", payload: validToken})
        
        } catch (error) {
            console.log(error)
            res.status(400)
        }
    }
}