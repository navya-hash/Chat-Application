const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const msgSchema=new mongoose.Schema({
   message:{
    type:String,
    required:true
   },
   users:{
    type:Array
   },
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
},{timestamps:true})

const Message=mongoose.model('Message Schema',msgSchema)
module.exports=Message