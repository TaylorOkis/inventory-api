import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createCustomer = async (req: Request, res: Response) => {
  const {
    customerType,
    email,
    firstName,
    lastName,
    phone,
    gender,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    NIN,
    country,
    location,
  } = req.body;

  const existingCustomerByPhone = await db.customer.findUnique({
    where: {
      phone,
    },
  });

  if (existingCustomerByPhone) {
    res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Phone number (${phone}) already in use.`,
    });
    return;
  }

  if (email) {
    const existingCustomerByEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });

    if (existingCustomerByEmail) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Email (${email}) already in use.`,
      });
      return;
    }
  }

  if (NIN) {
    const existingCustomerByNIN = await db.customer.findUnique({
      where: {
        NIN,
      },
    });

    if (existingCustomerByNIN) {
      res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `NIN (${NIN}) already in use.`,
      });
      return;
    }
  }

  const newCustomer = await db.customer.create({
    data: {
      customerType,
      email,
      firstName,
      lastName,
      phone,
      gender,
      maxCreditLimit,
      maxCreditDays,
      taxPin,
      NIN,
      country,
      location,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newCustomer, error: null });
};

const getCustomers = async (req: Request, res: Response) => {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: customers, error: null });
};

const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await db.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Customer not found", data: null });
    return;
  }

  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: customer, error: null });
};

export { createCustomer, getCustomers, getCustomerById };
