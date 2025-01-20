import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "@/controllers/product-controller";

const productRouter = express.Router();

productRouter.route("/").post(createProduct).get(getProducts);
productRouter
  .route("/:id")
  .get(getProductById)
  .patch(updateProductById)
  .delete(deleteProductById);

export default productRouter;
