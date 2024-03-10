// Initiate app and run server at 3000

const express = require('express');
const app = express();
const path=require('path');


app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

// Task 2:create mongoDB connection 

const mongoose=require('mongoose');
const mongoDB_URL='mongodb+srv://devakalyan8590:DEVAN1711@cluster0.3cc27aa.mongodb.net/employdb'
mongoose.connect(mongoDB_URL).then(()=>{
    console.log("Mongodb is connected");
})
.catch(()=>{
    console.log("mongodb connection error",);
})

const employeeModel = mongoose.Schema({
    name:String,
    location:String,
    position:String,
    salary:Number
},{ versionkey: false })

const employeeSchema = mongoose.model('employe',employeeModel);

// Task 2: write api with error handling and appropriate api mentioned in the TODO below

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist',async(req,res)=>{
try{
    const employees = await employeeSchema.find();
    res.status(200).send(employees); 
} catch (error){
    res.status(404).send('Get error! cannot fetch employees',error);
}
})

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req,res) =>{
 try{
    const id = req.params.id;
    if (!mongoose,Types.ObjectId.isvalid(id)) {
       return res.status(400).send('Invalid employee ID');
    }
    const employee = await employeeSchema.findOne({_id: id});
    if (!employee) {
        return res.status(404).send('Employee not found');
    }
    res.json(employee);
 } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
 }
});


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist',(req,res) => {
    try{
     
    const newEmployee = new employeeSchema({
        name: req.body.name,
        location: req.body.location,
        position: req.body.position,
        salary: req.body.salary,
    });

 // save new employee
  console.log(newEmployee)
  newEmployee.save();
  res.status(200).send('New employee created');
} catch (error) {
    console.error('Unable to create employee:' , error);
    res.status(400).send('Unable to create employee: ' + error.message);
}
});


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id',(req,res) => {
    try {
        const query = {_id:req.params.id};
        employeeSchema.deleteOne(query).then((newEmployee)=>{
            res.status(200).json('Delete employee entry');
        })
    } catch (error){
        res.status(400).json('Unable to delete',error);
    }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}


app.put('/api/employeelist',(req, res)=>{
try {
    const query = {name:req.body.name};   
    employeeSchema.findOne(query).then((newEmployee)=>{
      newEmployee.location = req.body.location;   
      newEmployee.position = req.body.position; 
      newEmployee.salary = req.body.salary;
      newEmployee.save().then(()=>{  
        res.status(200).json('Employee updated successfully');

      })
    })
} catch (error) {
    res.status(404).json('Unable to update employee'+error);
}
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});
