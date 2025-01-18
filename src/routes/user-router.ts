import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserPasswordById,
  deleteUserById,
} from "@/controllers/user-controller";

const userRouter = express.Router();

userRouter.route("/").post(createUser).get(getUsers);
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);
userRouter.route("/updatePassword/:id").patch(updateUserPasswordById);
// userRouter.get("/:id", getCustomerById);
// userRouter.post("/", createCustomer);

export default userRouter;
