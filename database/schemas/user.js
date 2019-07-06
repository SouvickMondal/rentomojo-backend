const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    email :String,
    name :String,
    password : String   
})

class User{
    static async findByEmail(email){
        try{
            const result = await this.model.findOne({email:email})
            return result
        }
        catch(e){
            return e
        }
    }
    static async findById(id){
        try{
            const result = await this.model.findOne({_id:id})
            return result
        }
        catch(e){
            return e
        }
    }
    static async findByName(name){
        try{
            const result = await this.model.find({name : name})
            return result
        }
        catch(e){
            return e
        }
    }
    static async createUser(email,name,password){
        const user = new this.model({
            email:email,
            name:name,
            password:password
        });
        try{
            const status =  await user.save()
            return status
        }
        catch(e){
            return e
        }
    }
    static async display(){
        console.log(await this.model.find())
    }
}
User.model = mongoose.model("User",userSchema)
module.exports = User