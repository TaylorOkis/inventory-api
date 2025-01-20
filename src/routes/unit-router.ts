import express from "express";
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById,
} from "@/controllers/unit-controller";

const unitRouter = express.Router();

unitRouter.route("/").post(createUnit).get(getUnits);
unitRouter
  .route("/:id")
  .get(getUnitById)
  .patch(updateUnitById)
  .delete(deleteUnitById);

export default unitRouter;
