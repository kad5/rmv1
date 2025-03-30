require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const router = require("./v1/v1router");

const app = express();

app.use(helmet());
app.use((req, res, next) => {
  res.set({
    "Cache-Control":
      "no-store, no-cache, must-revalidate, proxy-revalidate, , private",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.DEV_ORIGIN, process.env.PROD_ORIGIN],
    credentials: true,
  })
);

app.use("/api/v1", router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
