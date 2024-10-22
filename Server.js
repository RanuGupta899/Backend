// signup
// Signschema Email password username

const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
// const {error}=require('console');

const app=express();
app.use(bodyParser.json());
const mongoURI='mongodb://localhost:27017/CRMdatabase';
mongoose.connect(mongoURI)
.then(()=> console.log('MondoDB connected Successfully'))
.catch(error=>console.log(error));
//create user Schema
const signupSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
       
    },
});


//create User Model
const Signup=mongoose.model('Signup',signupSchema);
//Post Api
app.post('/api/signup',async(req,res)=>{
    try{
    const {username,email,password}=req.body;
    //check for missing fields
    if(!username||!email||!password){
        return res.status(400).json({message:'All field are required'});
    }
    //create a new user instance
    const newSignup=new Signup({
        username,
        email,
        password
    });
    //save user to the database
    await newSignup.save();
    res.status(201).json({message:'Signup created successfully',signup:newSignup});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error creating user'})
    }
});




const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)

})