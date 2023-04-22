import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authroutes from './routes/authRoute.js';
//config env
dotenv.config();

//database config
connectDB();
//rest object
const app =express();


//middlewares
app.use(express.json())
app.use(morgan('dev'))

//Routes
app.use('/api/v1/auth',authroutes);
//rest api
app.get('/',(req,res)=>{
    res.send({
        message:"Welcome to ecommerce app"
    })
})

//PORT
const PORT=process.env.PORT || 8080 ;

//run listen
app.listen(PORT,()=>{
    console.log(`Server Running on ${process.env.DEV_MODE} mode on Port ${PORT}`.bgCyan.white)
})