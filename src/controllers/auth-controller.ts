import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import generateAccessToken from "@/utils/generateJWT";

const login = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  let existingUser;

  if (email) {
    existingUser = await db.user.findUnique({
      where: { email },
    });
  }

  if (username) {
    existingUser = await db.user.findUnique({
      where: { username },
    });
  }

  if (!existingUser) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: "fail",
      data: null,
      error: "Wrong username or password",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: "fail",
      data: null,
      error: "Wrong username or password",
    });
    return;
  }

  const { password: savedPassword, ...otherData } = existingUser;
  const accessToken = generateAccessToken(otherData);
  const result = { ...otherData, accessToken };

  res.status(StatusCodes.OK).json({ status: "success", data: result });
};

export { login };
