require('dotenv').config()
const mongoose = require("mongoose")
mongoose.connect("mongodb://mayank9804:mayankisbest12/@ds347707.mlab.com:47707/rentomojo")
    .then(() => {console.log("Connected")})
    .catch((err) => {console.log("Could not connect",err)})
