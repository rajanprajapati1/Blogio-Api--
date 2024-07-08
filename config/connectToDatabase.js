import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database");
    } else {
      await mongoose.connect(process.env.DATABASE_URL);
      console.log("Connected to MongoDb");
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectToDatabase;
