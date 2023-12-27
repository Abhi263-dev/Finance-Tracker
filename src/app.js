const express=require('express')
const userRouter = require('./routers/user')
const db = require('../db/index')

const app=express()

const port=process.env.PORT||3000

app.use(express.json())
app.use(userRouter)


app.listen(port,()=>{
    console.log("Connected")
})

