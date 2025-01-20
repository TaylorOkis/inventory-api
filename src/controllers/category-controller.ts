import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  const existingCategory = await db.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Category (${name}) already exist`,
    });
  }

  const newCategory = await db.category.create({
    data: {
      name,
      slug,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newCategory, error: null });
};

const getCategorys = async (req: Request, res: Response) => {
  const categorys = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    count: categorys.length,
    data: categorys,
    error: null,
  });
};

const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingCategory = await db.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Category doesn't exist" });
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: existingCategory,
    error: null,
  });
};

const updateCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  const existingCategory = await db.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
  }

  if (slug !== existingCategory.slug) {
    const existingCategoryBySlug = await db.category.findUnique({
      where: { slug },
    });
    if (existingCategoryBySlug) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        error: `Slug (${slug}) already exist`,
        data: null,
      });
    }
  }

  const updateCategory = await db.category.update({
    where: { id },
    data: { name, slug },
  });
  return res
    .status(StatusCodes.OK)
    .json({ status: "success", data: updateCategory, error: null });
};

const deleteCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const Category = await db.category.findUnique({
    where: { id },
  });
  if (!Category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Category not found", data: null });
  }

  await db.category.delete({
    where: { id },
  });

  return res.status(StatusCodes.OK).json({ status: "success" });
};

export {
  createCategory,
  getCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
