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
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Phone number (${phone}) already in use.`,
    });
  }

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

  if (NIN) {
    const existingCustomerByNIN = await db.customer.findUnique({
      where: {
        NIN,
      },
    });

    if (existingCustomerByNIN) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `NIN (${NIN}) already in use.`,
      });
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
  return res.status(StatusCodes.CREATED).json(newCustomer);
};

const getCustomers = async (req: Request, res: Response) => {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.status(StatusCodes.OK).json(customers);
};

const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await db.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Customer not found", data: null });
  }

  return res.status(StatusCodes.OK).json(customer);
};

export { createCustomer, getCustomers, getCustomerById };
