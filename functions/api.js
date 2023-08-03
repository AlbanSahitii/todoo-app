const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/user.js");
const todo = require("./src/routes/todo.js");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");

require("dotenv").config({ path: "../.env" });

const uri =
  "mongodb+srv://albansahiti2002:0kTgyfWZeKsXRMbZ@cluster0.g1tvkg6.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(`uri init`);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log(`Database connected succesfully`);
});

console.log(`database `);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

module.exports.handler = serverless(app);
