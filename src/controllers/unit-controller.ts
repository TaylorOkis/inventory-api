import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createUnit = async (req: Request, res: Response) => {
  const { name, abbreviation, slug } = req.body;

  const existingUnit = await db.unit.findUnique({
    where: { slug },
  });

  if (existingUnit) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Unit (${name}) already exist`,
    });
  }

  const newUnit = await db.unit.create({
    data: {
      name,
      abbreviation,
      slug,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newUnit, error: null });
};

const getUnits = async (req: Request, res: Response) => {
  const units = await db.unit.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", count: units.length, data: units, error: null });
};

const getUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingUnit = await db.unit.findUnique({
    where: { id },
  });

  if (!existingUnit) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Unit doesn't exist" });
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: existingUnit,
    error: null,
  });
};

const updateUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, abbreviation, slug } = req.body;

  const existingUnit = await db.unit.findUnique({
    where: { id },
  });

  if (!existingUnit) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "User not found", data: null });
  }

  if (slug !== existingUnit.slug) {
    const existingUnitBySlug = await db.unit.findUnique({
      where: { slug },
    });
    if (existingUnitBySlug) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        error: `Slug (${slug}) already exist`,
        data: null,
      });
    }
  }

  const updateUnit = await db.unit.update({
    where: { id },
    data: { name, abbreviation, slug },
  });
  return res
    .status(StatusCodes.OK)
    .json({ status: "success", data: updateUnit, error: null });
};

const deleteUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const unit = await db.unit.findUnique({
    where: { id },
  });
  if (!unit) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Unit not found", data: null });
  }

  await db.unit.delete({
    where: { id },
  });

  return res.status(StatusCodes.OK).json({ status: "success" });
};

export { createUnit, getUnits, getUnitById, updateUnitById, deleteUnitById };
