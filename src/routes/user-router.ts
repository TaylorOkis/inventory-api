import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserPasswordById,
  deleteUserById,
  getAttendants,
} from "@/controllers/user-controller";

const userRouter = express.Router();

userRouter.route("/updatePassword/:id").patch(updateUserPasswordById);
userRouter.route("/attendants").get(getAttendants);
userRouter.route("/").post(createUser).get(getUsers);
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export default userRouter;
