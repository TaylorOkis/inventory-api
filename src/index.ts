import express from "express";
import cors from "cors";
import customerRouter from "./routes/customer-router";
import userRouter from "./routes/user-router";
import shopRouter from "./routes/shop-router";

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// GET REQUEST
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shops", shopRouter);

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
