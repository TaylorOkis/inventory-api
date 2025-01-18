import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createCustomer = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  const newCustomer = await db.customer.create({
    data: { name, email, phone },
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

  return res.status(StatusCodes.OK).json(customer);
};

export { createCustomer, getCustomers, getCustomerById };
