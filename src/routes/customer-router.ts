import express from "express";
import {
  createCustomer,
  getCustomerById,
  getCustomers,
} from "@/controllers/customer-controller";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.post("/", createCustomer);

export default customerRouter;
