import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Data Base Connect 
import connectDB from "./config/connectDB.js";

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 8005;

app.disable("x-powered-by");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// Data Base Call
connectDB();

app.listen(PORT, () => {
  console.log(`Server running PORT Number is ${PORT}`);
});
