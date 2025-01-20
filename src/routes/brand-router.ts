import express from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
} from "@/controllers/brand-controller";

const brandRouter = express.Router();

brandRouter.route("/").post(createBrand).get(getBrands);
brandRouter
  .route("/:id")
  .get(getBrandById)
  .patch(updateBrandById)
  .delete(deleteBrandById);

export default brandRouter;
