import express from "express";
import {
  createCategory,
  getCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "@/controllers/category-controller";

const categoryRouter = express.Router();

categoryRouter.route("/").post(createCategory).get(getCategorys);
categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .patch(updateCategoryById)
  .delete(deleteCategoryById);

export default categoryRouter;
