import express, { Request, Response } from "express";
import z from "zod";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyUser } from "../middlewares/verifyUser";
import { AccountModel } from "../models/account.model";

const router = express.Router();

const signUpObject = z.object({
  username: z
    .string()
    .min(3, "Username should be more than 3 characters")
    .max(30, "Username should be less than 30 characters")
    .nonempty("Username should not be empty"),
  password: z
    .string()
    .min(5, "Password should be greater than 5 characters")
    .nonempty("Password cannot be empty"),
  firstName: z
    .string()
    .max(30, "First name cannot be greater than 30 characters")
    .nonempty("First name cannot be empty"),
  lastName: z
    .string()
    .max(30, "Last name cannot be greater than 30 characters")
    .nonempty("Last name cannot be empty"),
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsedBody = signUpObject.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        message: "Validation Failed",
        errors: parsedBody.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const { username, password, firstName, lastName } = parsedBody.data;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      res.status(400).json({
        error: "Username already exist, please try another one.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await AccountModel.create({
      userId: newUser._id,
      balance: Math.floor((Math.random() * 10 + 1) * 10000),
    });

    res.status(201).json({
      message: "User created successfully",
      id: newUser._id,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Error occured while signing up the user",
    });
    return;
  }
});

const signInObject = z.object({
  username: z.string().nonempty("Username cannot be empty."),
  password: z.string().nonempty("Password cannot be empty."),
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsedBody = signInObject.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        message: "Validation failed",
        error: parsedBody.error.issues[0].message,
      });
      return;
    }

    const { username, password } = parsedBody.data;

    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(400).json({
        error: "No such user found, please try signing up first",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(411).json({
        error: "Incorrect Credentials",
      });
      return;
    }

    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`);

    res.status(200).json({
      message: "Successfully signed In",
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Error occured while signing in user " + error,
    });
    return;
  }
});

const updateUserObject = z.object({
  firstName: z
    .string()
    .max(30, "First name cannot be greater than 30 characters")
    .nonempty("First name cannot be empty"),
  lastName: z
    .string()
    .max(30, "Last name cannot be greater than 30 characters.")
    .nonempty("Last name cannot be empty."),
  password: z
    .string()
    .min(5, "Password should range in between 5 and 30 characters.")
    .max(30)
    .nonempty("Password is a required field."),
});

router.put("/updateUser", verifyUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const parsedBody = updateUserObject.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        message: "Validation failed",
        error: parsedBody.error.issues.map((issue) => issue.message),
      });
      return;
    }
    const { firstName, lastName, password } = parsedBody.data;

    await UserModel.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      password,
    });

    res.status(200).json({
      message: "User updated successfully.",
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Error occured while updating user.",
    });
  }
});

router.get("/bulk", verifyUser, async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter || "";
    const user = await UserModel.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });
    res.json({
      users: user.map((u) => ({
        username: u.username,
        firstname: u.firstName,
        lastname: u.lastName,
        _id: u._id,
      })),
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Error occured while fetching users",
    });
  }
});

router.get("/me", verifyUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      res.status(400).json({
        error: "No such user found.",
      });
      return;
    }
    res.status(200).json({
      user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Error occured while fetching user details" + error,
    });
  }
});

export default router;
