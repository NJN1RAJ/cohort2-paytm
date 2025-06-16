import { Request, Response, Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { AccountModel } from "../models/account.model";
import { z } from "zod";
import mongoose from "mongoose";

const router = Router();

router.get("/balance", verifyUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const account = await AccountModel.findOne({
      userId,
    });

    res.status(200).json({
      balance: account?.balance,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

const transferObject = z.object({
  amount: z.number().nonnegative("Money to be transferred can't be negative"),
  to: z.string().nonempty("Recepient is a required field"),
});

router.post("/transfer", verifyUser, async (req: Request, res: Response) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const parsedBody = transferObject.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        message: "Validation Failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
      return;
    }
    const { amount, to } = parsedBody.data;

    const account = await AccountModel.findOne({
      userId: req.user.id,
    }).session(session);

    if (!account || account?.balance == null) {
      res.status(400).json({
        error: "No account found",
      });
      return;
    }

    if (account?.balance < amount) {
      res.status(400).json({
        error: "Insufficient Balance",
      });
      return;
    }

    const toAccount = await AccountModel.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      res.status(400).json({
        error: "Invalid Account",
      });
      return;
    }

    await AccountModel.updateOne(
      { userId: req.user.id },
      { $inc: { balance: -amount } }
    ).session(session);

    await AccountModel.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({
      message: "Transfer Successful",
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error " + error,
    });
    return;
  }
});

export default router;
