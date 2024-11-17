// signup
// Signschema Email password username

const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const PORT=3000;
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
       
    },
    password:{
        type:String,
        required:true,
       
    },
    gender:{
        type:String,
        required:true,
    },
    hobbies:{
        type:[String],
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
});


//create User Model
const Signup=mongoose.model('Signup',signupSchema);
//Post Api
app.post('/api/signup',async(req,res)=>{
    try{
    const {username,email,password,gender,status,hobbies}=req.body;
    //check for missing fields
    if(!username||!email||!password ||!gender ||!status){
        return res.status(400).json({message:'All field are required'});
    }
    //create a new user instance
    const newSignup=new Signup({
        username,
        email,
        password,
        gender,
        status,
        hobbies:hobbies || []
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

//Login Api
app.post('/api/login',async(req,res)=>{
    try{
    const{email,password}=req.body;
    if(!email || !password){
    return res.status(400).json({message:'Email and Password is required'});
    }
    //find the signup email
    const exitinguser=await Signup.findOne({email});
    if(!exitinguser){
        return res.status(400).json({message:'Invalid Email '});
    }
    //Data match check
    if(exitinguser.password!=password){
        return res.status(400).json({message:'Invalid password'});
    }
    res.status(200).json({message:'Login Successfully',user:exitinguser});
        }
    catch(error){
console.error('Error during Login',error);
res.status(500).json({message:'Error during login'});
    }
}) 

//delete api
app.delete('/api/del/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    //find user by id
    const deleteduser=await Signup.findByIdAndDelete(id);
    if(!deleteduser){
        return res.status(400).json({message:'User Not find'});
    }
    res.status(200).json({message:'User deleted sucessfully',user:deleteduser});
}
catch(error){
    console.error('error deleting user',error);
    res.status(500).json({message:'Error deleting user'});
}

});
// get api
// Get Api to fetch user with status Active
app.get('/api/users/active',async(req,res)=>{
    try{
        const activeusers=await Signup.find({status:'Active'});
        if(activeusers.length===0){
           return res.status(404).json({message:'No Active user'});
        }
        res.status(200).json({users:activeusers});
    }
    catch(error){
        res.status(500).json({message:"error"});
        console.log("getting error");
       
    }
});





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)

})