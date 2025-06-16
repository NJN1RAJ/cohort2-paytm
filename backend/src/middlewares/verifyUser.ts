import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(403).json({
        error: "No token provided in headers.",
      });
    }

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!decoded) {
      res.status(400).json({
        error: "Error occured while verifying token",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      error: "Error occured while verifying user.",
    });
  }
};
