import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectToDB = () => {
  mongoose
    .connect(`${process.env.DB_URI}`)
    .then(() => {
      console.log("Successfully connected to the DB");
    })
    .catch((err) => {
      console.log("Error while connecting to DB " + err);
    });
};

export default connectToDB;
