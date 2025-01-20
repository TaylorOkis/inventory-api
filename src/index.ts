import express from "express";
import cors from "cors";
import customerRouter from "./routes/customer-router";
import userRouter from "./routes/user-router";
import shopRouter from "./routes/shop-router";
import supplierRouter from "./routes/supplier-router";
import authRouter from "./routes/auth-router";
import unitRouter from "./routes/unit-router";
import brandRouter from "./routes/brand-router";
import categoryRouter from "./routes/category-router";
import productRouter from "./routes/product-router";

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTERS
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);

const PORT = process.env.PORT || 5000;

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(`Something with run while initializing app. ${error}`);
  }
};

start();
