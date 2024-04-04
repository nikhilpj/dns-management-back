const mongoose = require('mongoose')
require("dotenv").config()

const connectDb =mongoose.connect(process.env.DATABASE_URI).then(()=>{
    console.log('mongodb connected')
}).catch((e)=>{
    console.log('eroor occured while connecting db',e)
})

module.exports= connectDb