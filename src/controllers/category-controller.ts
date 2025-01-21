import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  const existingCategory = await db.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Category (${name}) already exist`,
    });
    return;
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
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Category doesn't exist" });

    return;
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
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
    return;
  }

  if (slug !== existingCategory.slug) {
    const existingCategoryBySlug = await db.category.findUnique({
      where: { slug },
    });
    if (existingCategoryBySlug) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        error: `Slug (${slug}) already exist`,
        data: null,
      });
      return;
    }
  }

  const updateCategory = await db.category.update({
    where: { id },
    data: { name, slug },
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: updateCategory, error: null });
};

const deleteCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const Category = await db.category.findUnique({
    where: { id },
  });
  if (!Category) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Category not found", data: null });
    return;
  }

  await db.category.delete({
    where: { id },
  });

  res.status(StatusCodes.OK).json({ status: "success" });
};

export {
  createCategory,
  getCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
