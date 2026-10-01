const Message = require("../MODELS/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const from = req.user?.id || req.body.from;
    const { to, message } = req.body;
    if (!from || !to || !message || !message.trim()) {
      return res.status(400).json({ status: false, msg: "Missing from, to, or message" });
    }
    const data = await Message.create({
      message: message.trim(),
      users: [from.toString(), to.toString()],
      sender: from,
    });
    if (data) {
      return res.json({ status: true, msg: "Message added successfully!", data });
    } else {
      return res.status(400).json({ status: false, msg: "Failed to add message!" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const from = req.user?.id || req.body.from;
    const { to } = req.body;
    if (!from || !to) {
      return res.json([]);
    }

    const messages = await Message.find({
      users: { $all: [from.toString(), to.toString()] },
    }).sort({ createdAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        _id: msg._id,
        fromSelf: msg.sender.toString() === from.toString(),
        message: msg.message,
        createdAt: msg.createdAt,
      };
    });

    return res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};

