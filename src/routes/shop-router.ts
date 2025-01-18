import express from "express";
import {
  createShop,
  getShops,
  getShopAttendants,
  getShopById,
} from "@/controllers/shop-controller";

const shopRouter = express.Router();

shopRouter.route("/").post(createShop).get(getShops);
shopRouter.route("/attendants/:id").get(getShopAttendants);
shopRouter.route("/:id").get(getShopById);

export default shopRouter;
