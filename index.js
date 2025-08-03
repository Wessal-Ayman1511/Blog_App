import express from "express";
import bootStrap from "./src/app.controller.js";
const port = 3000;
const app = express();

bootStrap(express, app)
app.listen(port, () => {
  console.log("app is running of port", port);
});
