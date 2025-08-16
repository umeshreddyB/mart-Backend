import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

import cors from 'cors';



const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/nxtmart";



mongoose.connect(MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB'); 
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);})

const userSchem= new mongoose.Schema({
  name : String,
  email : String,
  place : String,
  password: Number
})
const usern= mongoose.model("User",userSchem);

app.post("/login", async(req,res)=>{
    const {username,password}=req.body;
    const result = await usern.find({username,password})
    if(result.length>0){
        const payload={
          username,
          email
        }
      const token = jwt.sign(payload,"ABC") 
      res.status(200).json({token})
    }
    else{
      res.send("user invaild")
    }
})



app.post("/register",async(req,res)=>{

    const {username,email,place,password}=req.body;
    const result = await usern.find({username,password})
      if(result.length>0){
        res.status(200).send("user already register")
      }
      else{
        const newuser = new usern({username,email,place,password})
        newuser.save();
          const payload={
              username,
              email,
              place,
            }
          const token = jwt.sign(payload,"ABC") 
          res.status(200).json({token})
      }
})






