const express=require('express')
const userRouter = require('./routers/user')
const transrouter=require('./routers/transaction')
const Budgetrouter=require('./routers/budget')
const Reportrouter=require('./routers/report')

const db = require('../db/index')

const app=express()

const port=process.env.PORT||3000

app.use(express.json())
app.use(userRouter)
app.use(transrouter)
app.use(Budgetrouter)
app.use(Reportrouter)


app.listen(port,()=>{
    console.log("Connected")
})

