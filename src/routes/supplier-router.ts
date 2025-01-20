import express from "express";
import {
  createSupplier,
  getSupplierById,
  getSuppliers,
} from "@/controllers/supplier-controller";

const supplierRouter = express.Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplierById);
supplierRouter.post("/", createSupplier);

export default supplierRouter;
