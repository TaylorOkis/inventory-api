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

  if (email) {
    const existingCustomerByEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });

    if (existingCustomerByEmail) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Email (${email}) already in use.`,
      });
    }
  }

  if (regNumber) {
    const existingSupplierByRegNum = await db.supplier.findUnique({
      where: { regNumber },
    });

    if (regNumber) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Reg Number (${regNumber}) already in use.`,
      });
    }
  }

  const newSupplier = db.supplier.create({
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

  return res.status(StatusCodes.CREATED).json(newSupplier);
};

const getSuppliers = async (req: Request, res: Response) => {
  const suppliers = await db.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.status(StatusCodes.OK).json(suppliers);
};

const getSupplierById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = await db.supplier.findUnique({
    where: {
      id,
    },
  });

  if (!supplier) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Supplier not found", data: null });
  }

  return res.status(StatusCodes.OK).json(supplier);
};

export { createSupplier, getSupplierById, getSuppliers };
