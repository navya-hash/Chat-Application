const mongoose=require('mongoose')
require("dotenv").config()
console.log("MONGO_URL:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connected")
})
.catch((err)=>{
    console.log("Error")
})
