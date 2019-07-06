const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
    user_id:String,//Who wrote the comment
    text:String//what is the comment
})
class Comment{
    static async findByUser(user_id){
        try{
            const result = await this.model.find({user_id : user_id})
            return result
        }
        catch(e){
            return e;
        }
    }
    static async findAll(){
        try{
            const result = await this.model.find()
            return result
        }
        catch(e){
            return e
        }
    }
    static async createComment(user_id,text){
        const comment = new this.model({
            user_id : user_id,
            text : text
        })
        try{
            const status = comment.save()
            return status
        }
        catch(e){
            return e
        }
    }
}
Comment.model = mongoose.model("Comment",commentSchema)
module.exports = Comment