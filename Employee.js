

const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const PORT=3000;
// const {error}=require('console');

const app=express();
app.use(bodyParser.json());
const mongoURI='mongodb://localhost:27017/empdatabase';
mongoose.connect(mongoURI)
.then(()=> console.log('MondoDB connected Successfully'))
.catch(error=>console.log(error));
//create employee Schema
const employeeSchema=new mongoose.Schema({
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
    address:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    hobbies:{
        type:String,
        required:true,
    },
    salary:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    }
});


//create employee Model
const Employee=mongoose.model('Employee',employeeSchema);
//Post Api
app.post('/api/employeesignin',async(req,res)=>{
    try{
    const {username,email,password,address,gender,hobbies,salary,status}=req.body;
    //check for missing fields
    if(!username||!email||!password ||!address||!gender ||!salary){
        return res.status(400).json({message:'All field are required'});
    }
    //create a new employee instance
    const newEmployee=new Employee({
        username,
        email,
        password,
        address,
        gender,
        hobbies:hobbies || [], 
        salary
    });  //save employee to the database
    await newEmployee.save();
    res.status(201).json({message:'Employee  Signup created successfully',employee:newEmployee});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error creating user'})
    }
});




// Login Api
app.post('/api/employeelogin',async(req,res)=>{
    try{
const{email,password}=req.body;
if(!email || !password){
return res.status(400).json({message:'Email and Password is required'});
}
//find the  employee signup email
const exitingemployee=await Employee.findOne({email});
if(!exitingemployee){
    return res.status(400).json({message:'Invalid Email '});
}
//Data match check
if(exitingemployee.password!=password && exitingemployee.status!='Active'){
    return res.status(400).json({message:'Invalid password or is not active'});
}
res.status(200).json({message:'Login Successfully',employee:exitingemployee});
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
    //find employee by id
    const deleteduser=await Employee.findByIdAndDelete(id);
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




 //edit api
app.put('/api/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedata = req.body;
        // Find by id and update
        const updateEmployee = await Employee.findByIdAndUpdate(id, updatedata, {
            new: true,
            runValidators: true
        });
        
        if (!updateEmployee) {
            return res.status(404).json({ message: 'Employee Not Found' });
        }
        
        res.status(200).json({ message: 'Employee Updated Successfully', employee: updateEmployee });
    } catch(error){
        console.error("error:", error);
        res.status(500).json({ message: 'Error during update' });
    }
});




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)

})