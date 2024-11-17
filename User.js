const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const PORT=3000;

const app=express();
app.use(bodyParser.json());
const mongoURI='mongodb://localhost:27017/userdatabase';
mongoose.connect(mongoURI)
.then(()=> console.log('MongoDB connected Sucessfully'))
.catch(error=>console.log(error));

//create user Schema
const userSchema=new mongoose.Schema({
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
    status:{
        type:String,
        required:true,
    }
});

//Create User Model
const User=mongoose.model('User',userSchema);
//Post Api
app.post('/api/usersignin',async(req,res)=>{
    try{
        const{username,email,password,status}=req.body;
        //check for missing user instance
        const newUser=new User({
            username,
            email,
            password,
            status,

        });
        //save user to the database
        await newUser.save();
        res.status(201).json({message:'User Signin Successfully',user:newUser});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error cretaing user'})
    }
});

//Login Api
app.post('/api/userlogin', async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email ||!password){
            return res.status(400).json({message:"Email and password is required"});

        }
        //find the user signin email
        const exitinguser=await User.findOne({email});
        if(!exitinguser){
            return res.status(400).json({message:'Invalid Email'});
        }
        //Data match check
        if(exitinguser.password!=password && exitinguser.status!='Active'){
            return res.status(400).json({message:'Invalid password or is not active'});
        }
        res.status(200).json({message:'Login Successfully',user:exitinguser});
    }
    catch(error){
        console.error('Error during Login',error);
        res.status(500).json({message:'Error during login'});
    }
})
//delete Api
app.delete('/api/del/:id',async(req,res)=>{
    try{
        const{id}=req.params;
        //find user by id
        const deleteduser=await User.findByIdAndDelete(id);
        if(!deleteduser){
            return res.status(400).json({message:'User Not find'});
        }
        res.status(200).json({message:'User deleted Successfully',user:deleteduser});
    }
    catch(error){
        console.error('error deleting user',error);
        res.status(500).json({messge:'Error Deleting user'});
    }
});


//edit Api
app.put('/api/edit/:id', async (req,res)=>{
    try{
        const{id}=req.params;
        const updatedata=req.body;
        //FInd by id and update
        const updateUser=await User.findByIdAndUpdate(id,updatedata,{
            new:true,
            runValidators:true
        });
        if(!updateUser){
            return res.status(404).json({messge:'User not found'});
        }
        res.status(200).json({message:'User Updated Successfully', user:updateUser});
    }
    catch(error){
        console.error("error:",error);
        res.status(500).json({message:'Error during update'});
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
