const mongoose = require('mongoose')

const connectDb =mongoose.connect('mongodb://127.0.0.1:27017/lucidgrowth').then(()=>{
    console.log('mongodb connected')
}).catch((e)=>{
    console.log('eroor occured while connecting db',e)
})

module.exports= connectDb