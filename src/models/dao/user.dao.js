import { UserResponseDto } from "../../dto/user.dto.js";
import userModel from "../user.model.js";
import { ObjectId } from "mongodb";

class UserDao{
    async getAll(){
        const users = await userModel.find()
        return users
    }

    async findById(id){
        const user = await userModel.findOne({_id: new ObjectId(id)})
        return user
    }
    
    async findByIdAndUpdate(id,data){
        const user = await userModel.findByIdAndUpdate(id, data)
        return user
    }

    async findOne(filter){
        const user = await userModel.findOne(filter)
        return user
    }
    
    async findOneLean(filter){
        const user = await userModel.findOne(filter).lean()
        return user
    }

    async findOnePopulate(filter, populate){
        const user = await userModel.findOne(filter).populate(populate)
        return user
    }

    async create(data){
        const user = await userModel.create(data)
        return user
    }
    
    async createMany(data){
        const user = await userModel.insertMany(data)
        return user
    }

    async createDTO(filter){
        const dbUser = await userModel.findOne(filter).lean();
        const user = new UserResponseDto(dbUser)
        return user
    }
    async deleteOne(id){
        const user = await userModel.deleteOne(id)
        return user
    }
}

export const userDao = new UserDao;