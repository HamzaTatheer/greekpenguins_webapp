const express= require("express");
const path=require("path");
const bcrypt= require("bcrypt");
const collection= require("./config");

const app= express();
//cover data into json format
const islandsData= require("/Users/andreaparadiso/Desktop/Progetto_CI/api/islands.js")

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.set("view engine","ejs");

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.get("/islands", (req,res)=> {
    res.render('islands',{ islands: islandsData })
})

// Registrer User
app.post("/signup",async (req,res)=>{
    const data= {
        name: req.body.username,
        password: req.body.password
    }

    //CHECK IF THE USER ALREADY EXISTS IN THE DATABASE 
    const existingUser= await collection.findOne({name: data.name});
    if(existingUser){
        res.send("User Already exists.");
    }else{
        // hash the password
        const saltRounds= 10;
        const hashedPassowrd = await bcrypt.hashSync(data.password, saltRounds);

        data.password= hashedPassowrd;

        const userdata = await collection.create(data);
        console.log(userdata);
        res.render("login");
    }
    ;

})


// LOGIN USER
app.post("/login", async(req,res)=>{
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            res.send("user name cannot found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("home")
        }else{
            req.send("wong password");
        }
    }catch{
        res.send("wrong Details");
    }
})

const port = 2323;
app.listen(port,()=>{
    console.log("Server running on Port: 2323");
})