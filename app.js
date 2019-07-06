require("dotenv").config()
const cors =  require("cors")
const port = process.env.PORT
require("./database/connection")
const User = require("./database/schemas/user")
const Comment = require("./database/schemas/comment")
const Vote = require("./database/schemas/vote")
//Express
const express = require("express")
const app = express()

app.use(cors({credentials:true,origin:true}))
app.use(express.urlencoded({extended:true}));
app.use(express.json());

async function registerUser(req,res){
    let email = req.body['email']
    let name = req.body['name']
    let password = req.body['password']
    
    if(email && password && name){
        if(await User.findByEmail(email))
            res.send({status: -1,description:"email exists"})
        else{
            const result = await User.createUser(email,name,password)
            console.log(result)
            res.send({status : 200, token: result["_id"]})
        }
    }
    else
        res.send({status:-1,description:"Fields not entered completely"})
}

async function loginUser(req,res){
    let email = req.body['email']
    let password = req.body['password']
    console.log(req.body)
    if(email && password){
        const result = await User.findByEmail(email)
        if(!result)
            res.send({status: -1, description: "account doesn't exist"})
        else if(result.password != password)
            res.send({status: -1,description:'password doesnt match'})
        else
            res.send({status: 200,token: result["_id"]})
    }
    else{
        res.send({status: -1,description: "details not entered"})
    }
}
async function fetchComments(req,res){
    const id = req.header('authorization')
    let result = await Comment.findAll()
    const upvote = await Vote.getVotesOfUser(id,true)
    const downvote = await Vote.getVotesOfUser(id,false)
    // console.log(downvote)
    let output = []
    for(let i=0;i<result.length;++i){
        let dat ={}
        dat["comment"] = {id: result[i]["_id"],text: result[i]["text"]}
        dat["my_status"] = 0
        if(upvote.hasOwnProperty(result[i]["_id"]))
            dat["my_status"] = 1
        else if(downvote.hasOwnProperty(result[i]["_id"]))
            dat["my_status"] = -1
        dat["upvote"] = await Vote.getCount(result[i]["_id"],true)
        dat["downvote"] = await Vote.getCount(result[i]["_id"],false)
        let user = await User.findById(result[i]["user_id"])
        dat["user"] = {id: user["_id"],name: user["name"]}
        output.push(dat)
    }
    // console.log(output)
    res.send({status:200,comments: output})
}
async function postComment(req,res){
    const id = req.header('authorization')
    const text = req.body['text']
    const result = await Comment.createComment(id,text)
    res.send({status:200})
}
async function incrementUpVote(req,res){
    const id = req.header('authorization')
    const comment_id = req.params["comment_id"]
    const result  = await Vote.addVote(id,comment_id,true)
    if(await Vote.findVote(id,comment_id,false))
        await Vote.removeVote(id,comment_id,false)
    res.send({status:200,result:result})
}
async function incrementDownVote(req,res){
    const id = req.header('authorization')
    const comment_id = req.params["comment_id"]
    const result  = await Vote.addVote(id,comment_id,false)
    if(await Vote.findVote(id,comment_id,true))
        await Vote.removeVote(id,comment_id,true)
    res.send({status:200,result:result})
}
//Routes
app.post("/api/createUser",registerUser)
app.post("/api/loginUser",loginUser)
app.get("/api/fetchComments",fetchComments)
app.post("/api/postComment",postComment)
app.get("/api/upvote/:comment_id",incrementUpVote)
app.get("/api/downvote/:comment_id",incrementDownVote)
app.get("/",(req,res)=>{
    res.send("HELLOWORLD")
})

app.listen(port,console.log("Listening at port: ",port))