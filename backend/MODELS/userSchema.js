const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
},
isAvatarSet:{
    type:Boolean,
    default:false
},
AvatarImage:{
    type:String,
    default:""
}
})

const User=mongoose.model('User',userschema)
module.exports=User