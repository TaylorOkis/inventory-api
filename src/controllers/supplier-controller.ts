import { db } from "@/db/db";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

const createSupplier = async (req: Request, res: Response) => {
  const {
    supplierType,
    email,
    name,
    contactPerson,
    phone,
    regNumber,
    bankAccountNumber,
    bankName,
    website,
    country,
    location,
    logo,
    rating,
    notes,
  } = req.body;

  const existingSupplierByPhone = await db.supplier.findUnique({
    where: { phone },
  });

  if (existingSupplierByPhone) {
    res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Phone number (${phone}) already in use.`,
    });
    return;
  }

  if (email) {
    const existingSupplierByEmail = await db.supplier.findUnique({
      where: {
        email,
      },
    });

    if (existingSupplierByEmail) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Email (${email}) already in use.`,
      });
      return;
    }
  }

  if (regNumber) {
    const existingSupplierByRegNum = await db.supplier.findUnique({
      where: { regNumber },
    });

    if (existingSupplierByRegNum) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Reg Number (${regNumber}) already in use.`,
      });
      return;
    }
  }

  const newSupplier = await db.supplier.create({
    data: {
      supplierType,
      email,
      name,
      contactPerson,
      phone,
      regNumber,
      bankAccountNumber,
      bankName,
      website,
      country,
      location,
      logo,
      rating,
      notes,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newSupplier, error: null });
};

const getSuppliers = async (req: Request, res: Response) => {
  const suppliers = await db.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: suppliers, error: null });
};

const getSupplierById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = await db.supplier.findUnique({
    where: {
      id,
    },
  });

  if (!supplier) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Supplier not found", data: null });
    return;
  }

  res.status(StatusCodes.OK).json(supplier);
};

export { createSupplier, getSupplierById, getSuppliers };
