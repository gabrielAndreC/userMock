import { expect }from 'chai'
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
        expect(newUser).to.have.property("email")
    })
    
    it('Obtener todos los usuarios', async function(){
        const users = await userDao.getAll()
        expect(Array.isArray(users)).to.be.ok
    })
        
    it('Obtener un usuario', async function(){
        const user = await userDao.findById(userId)
        
        expect(user).to.be.a('object')
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
            
            expect(user.lastName).to.equal("Nuevo")
        })
        
    it('Eliminar un usuario', async function(){
        const deleteUser = await userDao.deleteOne(userId)
        const user = await userDao.findById(userId)
        
        expect(user).to.be.a("null")
    })
})