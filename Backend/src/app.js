import dotenv from "dotenv"
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/user.routes.js";
const app = express();

// console.log(process.env.MONGO_URI);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("StackMate API is running 🚀");
});

app.use("/api/v1",userRouter)



app.listen(5000, () => {
  connectDb();
  console.log("Server running on port 5000");
});