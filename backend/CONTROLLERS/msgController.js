const Message = require("../MODELS/messageModel");


module.exports.addMessage=async(req,res,next)=>{
    try{
    const {from,to,message}=req.body;
    const data=await Message.create({
        message:message,
        users:[from,to],
        sender:from,


    })
    if(data){
        res.json({
            msg:"Message added successfully!"
        })
    }
    else{
        res.json({
            msg:"Failed to add message!"
        })
    }
}
catch(err){
    next(err)
}

}


module.exports.getAllMessages = async (req, res, next) => {
  try {
    
    const { from, to } = req.body;

    const messages = await Message
      .find({
        users: { $all: [from, to] }, // Match conversations between "from" and "to"
      })
      .sort({ updatedAt: 1 }); // Sort messages in ascending order (old → new)

    // Format messages for frontend consumption
    const projectMessages = messages.map((msg) => {
  return {
    fromSelf: msg.sender.toString() === from,
    message: msg.message
  };
});


    // Send the formatted messages as JSON
    res.json(projectMessages);
  } catch (ex) {
    next(ex); // Pass error to middleware
  }
};

