const mongoose = require('mongoose');
require("dotenv").config();
console.log("MONGO_URL:", process.env.MONGO_URL);

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mydb';

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

