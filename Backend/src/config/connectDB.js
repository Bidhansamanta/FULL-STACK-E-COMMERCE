import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const hostDB = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Data Base Connected Successfully`, hostDB.connection.host);
  } catch (error) {
    console.log(`Error while creating Data Base`);
  }
}

export default connectDB;