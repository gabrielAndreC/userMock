import { Router } from "express";
import { faker } from "@faker-js/faker";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import { AccountController } from "../controllers/account.controller.js";

const mockRouter = Router();

const accController = new AccountController;

mockRouter.get("/usermock", accController.mockRegister)

export default mockRouter