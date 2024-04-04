const express =require('express')
const user = require('./routes/userRoute')
const cors = require('cors')
const connectDb = require('./config/connect')

const app = express()
connectDb
const allowedOrigins = ['https://dns-management-front.onrender.com']

app.use(cors({
    origin:function (origin,callback)
     {
        
         if(allowedOrigins.indexOf(origin) !== -1)
         {
             callback(null,true)
         }
         else
         {
             callback(new Error('Not allowed by  cors'))
         }
     },
     
     methods: ['GET', 'POST','OPTIONS'],
     
    
  })) 

app.use(express.json({limit:'5mb'}))
app.use('/user',user)


app.listen(5000,(()=>console.log('server is running at port 5000')))