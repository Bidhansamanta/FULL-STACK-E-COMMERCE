import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Data Base Connect 
import connectDB from "./config/connectDB.js";

// Auth User Router
import userRouter from "./routes/auth.route.js";

// Product Router
import productRouter from "./routes/product.route.js";

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

// Auth User Route
app.use("/api/v1/user", userRouter);

// Product Route
app.use("/api/v1/product", productRouter);



app.listen(PORT, () => {
  console.log(`Server running PORT Number is ${PORT}`);
});
