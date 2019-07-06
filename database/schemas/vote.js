const mongoose = require("mongoose")
const upVoteSchema = new mongoose.Schema({
    user_id:String,//Who upvoted
    comment_id:String//which comment
})
const downVoteSchema = new mongoose.Schema({
    user_id:String,//Who downvoted
    comment_id:String//which comment
})
class Vote{
    static getIndex(isUpVote){
        let index = 0
        if(isUpVote == false)
            index = 1
        return index
    }
    static async addVote(user_id,comment_id,isUpVote){
        let index = this.getIndex(isUpVote)
        const vote = new this.model[index]({
            user_id : user_id,
            comment_id : comment_id
        })
        try{
            const status = await vote.save()
            return status
        }
        catch(e){
            return e
        }
    }
    static async findVote(user_id,comment_id,isUpVote){
        let index = this.getIndex(isUpVote)
        const result = await this.model[index].findOne({user_id:user_id,comment_id:comment_id})
        return result
    }
    static async getCount(comment_id,isUpVote){
        let index = this.getIndex(isUpVote)
        try{
            const count = await this.model[index].countDocuments({comment_id:comment_id})
            return count
        }
        catch(e){
            return e
        }
    }
    static async removeVote(user_id,comment_id,isUpVote){
        let index = this.getIndex(isUpVote)
        try{
            const result = await this.model[index].findOneAndRemove({user_id : user_id,comment_id : comment_id})
            return result
        }
        catch(e){
            return e
        }
    }
    static async getAllVotes(isUpVote){
        let index = this.getIndex(isUpVote)
        try{
            const result = await this.model[index].find()
            return result
        }
        catch(e){
            return e
        }
    }
    static async getVotesOfUser(user_id,isUpVote){
        let index = this.getIndex(isUpVote)
        try{
            const result = await this.model[index].find({user_id : user_id})
            const dic = {}
            for(let i=0;i<result.length;++i){
                dic[result[i]["comment_id"]] = true
            }
            return dic
        }
        catch(e){
            return e
        }
    }
}
Vote.model = [mongoose.model("UpVote",upVoteSchema),mongoose.model("DownVote",downVoteSchema)]

module.exports = Vote