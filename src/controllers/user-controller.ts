import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const createUser = async (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    firstname,
    lastname,
    phone,
    dob,
    gender,
    role,
    image,
  } = req.body;

  const existingUserByEmail = await db.user.findUnique({ where: { email } });
  if (existingUserByEmail) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ error: "Email Already Taken", data: null });
    return;
  }

  const existingUserByUsername = await db.user.findUnique({
    where: { username },
  });
  if (existingUserByUsername) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ error: "Username Already Taken", data: null });
    return;
  }

  const existingUserByPhone = await db.user.findUnique({ where: { phone } });
  if (existingUserByPhone) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ error: "Phone Number Already Taken", data: null });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      dob,
      gender,
      role,
      image: image
        ? image
        : "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png",
    },
  });

  const { password: savedPassword, ...others } = newUser;
  res.status(StatusCodes.CREATED).json({ status: "success", data: others });
};

const getUsers = async (req: Request, res: Response) => {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  const filterdUsers = users.map((user: any) => {
    const { password, ...others } = user;
    return others;
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    count: filterdUsers.length,
    data: filterdUsers,
  });
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
    return;
  }
  const { password, ...others } = user;
  res.status(StatusCodes.OK).json({ status: "success", data: others });
};

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, username, firstname, lastname, phone, dob, gender, image } =
    req.body;

  const existingUser = await db.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
    return;
  }

  if (email && email !== existingUser.email) {
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUserByEmail) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Email Already Taken", data: null });
      return;
    }
  }

  if (username && username !== existingUser.username) {
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Username Already Taken", data: null });
      return;
    }
  }

  if (phone && phone !== existingUser.phone) {
    const existingUserByPhone = await db.user.findUnique({ where: { phone } });
    if (existingUserByPhone) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Phone Number Already Taken", data: null });
      return;
    }
  }

  const updateUser = await db.user.update({
    where: { id },
    data: { email, username, firstname, lastname, phone, dob, gender, image },
  });
  const { password, ...others } = updateUser;
  res.status(StatusCodes.OK).json({ status: "success", data: others });
};

const updateUserPasswordById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  //TODO: Get the old password and compare it with the one already on the database.

  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  res.status(StatusCodes.OK).json({ status: "success" });
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
  }

  await db.user.delete({
    where: { id },
  });

  res.status(StatusCodes.OK).json({ status: "success" });
};

const getAttendants = async (req: Request, res: Response) => {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      role: "ATTENDANT",
    },
  });

  const filteredUsers = users.map((user: any) => {
    const { password, ...others } = user;
    return others;
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    count: filteredUsers.length,
    data: filteredUsers,
  });
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserPasswordById,
  deleteUserById,
  getAttendants,
};
