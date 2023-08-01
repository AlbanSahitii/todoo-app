const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const todo = require("./routes/todo.js");
const cookieParser = require("cookie-parser");

mongoose
  .connect("mongodb://localhost/todo")
  .then(() => {
    console.log(`connected to mongodb`);
  })
  .catch((err) => console.log(`couldnt connect ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/todo", todo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
