const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/user.js");
const todo = require("./src/routes/todo.js");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");

require("dotenv").config({ path: "../.env" });

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log(`Database connected succesfully`);
});

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

app.use("/user", userRoutes);
app.use("/todo", todo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

module.exports.handler = serverless(app);
