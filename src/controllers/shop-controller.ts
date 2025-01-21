import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createShop = async (req: Request, res: Response) => {
  const { name, slug, location, phone, adminId, attendantIds } = req.body;

  const existingShop = await db.shop.findUnique({
    where: { slug: slug },
  });

  if (existingShop) {
    res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Shop (${slug}) already exist`,
    });
    return;
  }

  const newShop = await db.shop.create({
    data: {
      name,
      slug,
      location,
      phone,
      adminId,
      attendantIds,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newShop, error: null });
};

const getShops = async (req: Request, res: Response) => {
  const shops = await db.shop.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", count: shops.length, data: shops, error: null });
};

const getShopAttendants = async (req: Request, res: Response) => {
  const { id: shopId } = req.params;
  const existingShop = await db.shop.findUnique({
    where: {
      id: shopId,
    },
  });

  if (!existingShop) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Shop doesn't exist" });
    return;
  }

  const attendants = await db.user.findMany({
    where: {
      id: {
        in: existingShop.attendantIds,
      },
    },
    omit: { password: true },
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    count: attendants.length,
    data: attendants,
    error: null,
  });
};

const getShopById = async (req: Request, res: Response) => {
  const { id: shopId } = req.params;
  const existingShop = await db.shop.findUnique({
    where: {
      id: shopId,
    },
  });

  if (!existingShop) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Shop doesn't exist" });
    return;
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: existingShop,
    error: null,
  });
};

export { createShop, getShops, getShopAttendants, getShopById };
