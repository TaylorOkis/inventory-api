import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createBrand = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  const existingBrand = await db.brand.findUnique({
    where: { slug },
  });

  if (existingBrand) {
    res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Brand (${name}) already exist`,
    });
    return;
  }

  const newBrand = await db.brand.create({
    data: { name, slug },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newBrand, error: null });
};

const getBrands = async (req: Request, res: Response) => {
  const brands = await db.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    count: brands.length,
    data: brands,
    error: null,
  });
};

const getBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingBrand = await db.brand.findUnique({
    where: { id },
  });

  if (!existingBrand) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Brand doesn't exist" });
    return;
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: existingBrand,
    error: null,
  });
};

const updateBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  const existingBrand = await db.brand.findUnique({
    where: { id },
  });

  if (!existingBrand) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
    return;
  }

  if (slug !== existingBrand.slug) {
    const existingBrandBySlug = await db.brand.findUnique({
      where: { slug },
    });
    if (existingBrandBySlug) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        error: `Slug (${slug}) already exist`,
        data: null,
      });
      return;
    }
  }

  const updateBrand = await db.brand.update({
    where: { id },
    data: { name, slug },
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: updateBrand, error: null });
};

const deleteBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await db.brand.findUnique({
    where: { id },
  });
  if (!brand) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Brand not found", data: null });
    return;
  }

  await db.brand.delete({
    where: { id },
  });

  res.status(StatusCodes.OK).json({ status: "success" });
};

export {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
