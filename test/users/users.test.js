import Assert from 'assert'
import mongoose from 'mongoose'
import { userDao } from '../../src/models/dao/user.dao.js'
import dotenv from 'dotenv'
import { describe } from 'mocha';
import crypto from 'crypto'

dotenv.config();
const uriMongo = process.env.URIMONGO;

mongoose.connect(uriMongo)
.then(()=> {console.log("DB Connected")})
.catch((error) =>{console.log(error)})

const assert = Assert.strict;

describe('Testing users', async()=>{

    let userId;

    it('Crear un usuario', async function(){
        const mockUser = {
            name: "Juan",
            lastName: "Perez",
            email: `juanperez${crypto.randomBytes(5).toString('hex')}@gmail.com`,
            password: "coder",
            age: 20,
            role: "user"
        }

        const newUser = await userDao.create(mockUser)
        userId = newUser._id
        assert.strictEqual(typeof newUser, "object")
    })

    it('Obtener todos los usuarios', async function(){
        const users = await userDao.getAll()

        assert.strictEqual(Array.isArray(users), true)
    })
    
    it('Obtener un usuario', async function(){
        const user = await userDao.findById(userId)
        
        assert.strictEqual(typeof user, "object")
    })
    
    it('Actualizar un usuario', async function(){
        const mockUser = {
            name: "Juan",
            lastName: "Nuevo",
            age: 20,
            role: "admin"
        }
        const userUpdate = await userDao.findByIdAndUpdate(userId, mockUser)

        const user = await userDao.findById(userId)

        assert.strictEqual(user.lastName, "Nuevo")
    })

    it('Eliminar un usuario', async function(){
        const deleteUser = await userDao.deleteOne(userId)
        const user = await userDao.findById(userId)

        assert.strictEqual(user, null)
    })
    
})