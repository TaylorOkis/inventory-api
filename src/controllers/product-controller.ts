import { db } from "@/db/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    alertQty,
    stockQty,
    barCode,
    sellingPrice,
    buyingPrice,
    tax,
    batchNumber,
    image,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate,
  } = req.body;

  const existingProductBySlug = await db.product.findUnique({
    where: { slug },
  });

  if (existingProductBySlug) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Product (${name}) already exist`,
    });
  }

  if (barCode) {
    const existingBarCode = await db.product.findUnique({
      where: { barCode },
    });

    if (existingBarCode) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Barcode (${barCode}) already exist`,
      });
    }
  }

  const existingSku = await db.product.findUnique({
    where: { sku },
  });

  if (existingSku) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Sku (${sku}) already exist`,
    });
  }

  const existingProductCode = await db.product.findUnique({
    where: { barCode },
  });

  if (existingProductCode) {
    return res.status(StatusCodes.CONFLICT).json({
      status: "fail",
      data: null,
      error: `Product code (${productCode}) already exist`,
    });
  }

  const newProduct = await db.product.create({
    data: {
      name,
      description,
      alertQty,
      stockQty,
      barCode,
      sellingPrice,
      buyingPrice,
      tax,
      batchNumber,
      image,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: newProduct, error: null });
};

const getProducts = async (req: Request, res: Response) => {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(StatusCodes.OK).json({
    status: "success",
    count: products.length,
    data: products,
    error: null,
  });
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingProduct = await db.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", data: null, error: "Product doesn't exist" });
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: existingProduct,
    error: null,
  });
};

const updateProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    alertQty,
    stockQty,
    barCode,
    sellingPrice,
    buyingPrice,
    tax,
    batchNumber,
    image,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate,
  } = req.body;

  const existingProduct = await db.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Product not found", data: null });
  }

  if (slug !== existingProduct.slug) {
    const existingProductBySlug = await db.product.findUnique({
      where: { slug },
    });
    if (existingProductBySlug) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        error: `Product (${name}) already exist`,
        data: null,
      });
    }
  }

  if (barCode !== existingProduct.barCode) {
    if (barCode) {
      const existingBarCode = await db.product.findUnique({
        where: { barCode },
      });

      if (existingBarCode) {
        return res.status(StatusCodes.CONFLICT).json({
          status: "fail",
          data: null,
          error: `Barcode (${barCode}) already exist`,
        });
      }
    }
  }

  if (sku !== existingProduct.sku) {
    const existingSku = await db.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Sku (${sku}) already exist`,
      });
    }
  }

  if (productCode !== existingProduct.productCode) {
    const existingProductCode = await db.product.findUnique({
      where: { barCode },
    });

    if (existingProductCode) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        data: null,
        error: `Product code (${productCode}) already exist`,
      });
    }
  }
  const updateProduct = await db.product.update({
    where: { id },
    data: {
      name,
      description,
      alertQty,
      stockQty,
      barCode,
      sellingPrice,
      buyingPrice,
      tax,
      batchNumber,
      image,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    },
  });
  return res
    .status(StatusCodes.OK)
    .json({ status: "success", data: updateProduct, error: null });
};

const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await db.product.findUnique({
    where: { id },
  });
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "fail", error: "Product not found", data: null });
  }

  await db.product.delete({
    where: { id },
  });

  return res.status(StatusCodes.OK).json({ status: "success" });
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
