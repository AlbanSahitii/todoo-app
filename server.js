const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const todo = require("./routes/todo.js");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");

require("dotenv").config();

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log(`Database connected succesfully`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/todo", todo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

module.exports.handler = serverless(app);
