import mongoose from "mongoose";

const acountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  balance: Number,
});

export const AccountModel = mongoose.model("Account", acountSchema);
