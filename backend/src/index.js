const express= require("express");
const path=require("path");
const bcrypt= require("bcrypt");
const {userModel,reviewModel}= require("./config");

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
        username: req.body.username,
        password: req.body.password
    }

    //CHECK IF THE USER ALREADY EXISTS IN THE DATABASE 
    const existingUser= await userModel.findOne({username: data.name});
    if(existingUser){
        res.send("User Already exists.");
    }else{
        // hash the password
        const saltRounds= 10;
        const hashedPassowrd = await bcrypt.hashSync(data.password, saltRounds);

        data.password= hashedPassowrd;

        const userdata = await userModel.create(data);
        console.log(userdata);
        res.render("login");
    }
    ;

})


// LOGIN USER
app.post("/login", async(req,res)=>{
    try{
        const check = await userModel.findOne({username: req.body.username});
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

// simply get review
app.get("/user",async (req,res)=>{
    try{
        return await userModel.findOne({username: req.body.username})
    }
    catch{
        res.send("/user can not send data")
    }
})


//post a review for a city
app.post('/api/reviews', async (req, res) => {
    try {
      const { username, city, rating, description } = req.body;
  
      // Find the user by username
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new review
      const newReview = new ReviewModel({
        city,
        rating,
        description,
      });
  
      // Add the review to the user's cityReviews array
      user.cityReviews.push(newReview);
  
      // Save the updated user document
      await user.save();
  
      res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  //get reviews by username
  app.get('/api/reviews/:username', async (req, res) => {
    try {
      const { username } = req.params;
  
      // Find the user by username
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.cityReviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });




const port = 2323;
app.listen(port,()=>{
    console.log("Server running on Port: 2323");
})