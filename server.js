const express =require('express')
const user = require('./routes/userRoute')
const cors = require('cors')
const connectDb = require('./config/connect')

const app = express()
connectDb
const corsOptions={
    origin:'http://localhost:3000',
    methods:['post','options']
}
app.use(cors(corsOptions))
app.use(express.json({limit:'5mb'}))
app.use('/user',user)


app.listen(5000,(()=>console.log('server is running at port 5000')))