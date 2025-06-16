import express from "express";
import userRouter from "./routes/userRouter";
import connectToDB from "./db";
import cors from "cors";
import dotenv from "dotenv";
import accountRouter from "./routes/accountRouter";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

try {
  connectToDB();
} catch (error) {
  console.log("Error connecting to DB " + error);
}

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
