
// Studentschema Email password username

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
//create Student Schema
const studentSchema=new mongoose.Schema({
       name:{
        type:String,
        required:true,

    },
    mobile:{
        type:String,
        required:true,
        
    },
    training:{
        type:[String],
        required:true,
       
    },
    technology:{
        type:[String],
        required:true,
    },
    education:{
        type:[String],
        required:true,
    },
    year:{
        type:[Number],
        required:true,
    },
    fathername:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    collegename:{
        type:[String],
        required:true,
    },
    payment:{
        type:String,
        enum:['fullpayment','registrationfee'],
        required:true,
    },
    amountType:{
        type:String,
        enum:['viacard',"banking",'googlepay']
    }
});


//create User Model
const Student=mongoose.model('Student',studentSchema);
//Post Api
app.post('/api/student',async(req,res)=>{
    try{
    const {name,mobile,training,technology,education,year,fathername,email,collegename,payment,amountType}=req.body;
    //check for missing fields
    if(!name||!mobile||!training||!technology||!education||!year||!fathername||!email||!collegename ||!payment ||!amountType){
        return res.status(400).json({message:'All field are required'});
    }
    //create a new user instance
    const newStudent=new Student({
        name,
        mobile,
        training,
        technology,
        education,
        year,
        fathername,
        email,
        collegename,
        payment,
        amountType,
        
    });
    //save user to the database
    await newStudent.save();
    res.status(201).json({message:'Student created successfully',student:newStudent});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error creating user'})
    }
});


//delete api
app.delete('/api/del/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    //find user by id
    const deleteduser=await Student.findByIdAndDelete(id);
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

//Get All Data Api
app.get('/api/student',async(req,res)=>{
    try{
        const student=await Student.find();
        return res.status(200).json(student);
    }
    catch(error){
        console.error(`Error fetching student:${error.message}`,error);
        res.status(500).json({message:'getting data error'});
    }

})
// get api
//Get Api to fetch user with status Active
// app.get('/api/users/active',async(req,res)=>{
//     try{
//         const activeusers=await Signup.find({status:'Active'});
//         if(activeusers.length===0){
//            return res.status(404).json({message:'No Active user'});
//         }
//         res.status(200).json({users:activeusers});
//     }
//     catch(error){
//         res.status(500).json({message:"error"});
//         console.log("getting error");
       
//     }
// });



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)

})