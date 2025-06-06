require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log("MongoDB connected !! DB HOST: " + mongoInstance.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed -->  " + err);
    process.exit(1);
  }
};


module.exports = connectDB































