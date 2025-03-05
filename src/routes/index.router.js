import { Router } from "express";
import __dirname, {verifyToken} from "../utils.js";
import { IndexController } from "../controllers/index.controller.js";
import { authenticateMw  } from "../middlewares/authenticate.middleware.js";
import { CartsController } from "../controllers/carts.controller.js";

const router = Router();

const indexController = new IndexController

const cartsController = new CartsController

router.use((req, res, next) => {
    const token = verifyToken(req.cookies.token)
    if (token){
        res.locals.cartId = token.cart || null;
        res.locals.userLogged = token.email || null;
        res.cookie("userRole",token.role,{signed:true});
    }

    next();
});

router.get('/', (req,res)=>{
    res.render("home",{style:"main.css"})
})

router.get('/products', indexController.getProducts)

router.get('/products/:pid', indexController.getProductById)

router.post('/products/:pid', authenticateMw("user") ,indexController.addToCart)

router.get('/carts/:cid', indexController.getCart)

router.post('/carts/:cid', indexController.updateCart)

router.get('/carts/:cid/purchase', indexController.purchaseView)

router.post('/carts/:cid/purchase', indexController.purchaseProcess)

router.get('/statusQuery', indexController.getStatusQuery)

router.get('/realtimeproducts', authenticateMw("admin"), indexController.getRealTimeProducts)

router.post('/realtimeproducts', authenticateMw("admin"), indexController.modifyRealTimeProducts)

export default router