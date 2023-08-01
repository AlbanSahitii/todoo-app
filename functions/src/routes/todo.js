const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("./model/model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

router.post("", async (req, res) => {
  if (!req.body._id) {
    return res.status(422).send({ message: "user id not found" });
  }
  if (!req.body.name) {
    return res.status(422).send({ message: "todo name not found" });
  }
  if (!req.body.description) {
    return res.status(422).send({ message: "description not found" });
  }

  const newToDo = {
    name: req.body.name,
    description: req.body.description,
  };

  const user = await Users.findOne({ _id: req.body._id }).catch((err) =>
    res.send(err)
  );
  if (!user) {
    return res.status(422).send({ message: "user not found" });
  }

  user.todo.push(newToDo);

  user
    .save()
    .then((savedUser) => {
      console.log("New todoItem added to user:", savedUser);
    })
    .catch((error) => {
      console.error("Error while saving user:", error);
    });

  res.send(user);
});

router.get("/:_id", authenticateToken, async (req, res) => {
  if (!req.params._id) {
    return res.status(422).send({ message: "user id not found" });
  }
  const user = await Users.findOne({ _id: req.params._id });
  if (!user) {
    return res.status(422).send({ message: "user not found" });
  }
  res.send(user.todo);
});

router.put("", authenticateToken, async (req, res) => {
  const { _id, todo_id, name, description } = req.body;
  if (!name || !description || !_id || !todo_id) {
    return res.status(422).send({ message: "missing data" });
  }

  const user = await Users.findOne({ _id: _id });

  if (!user) {
    return res.status(422).send({ message: "user not found" });
  }
  const todos = user.todo;

  const toChangeTodo = todos.find((element) => {
    element._id = todo_id;
    return element;
  });

  toChangeTodo.name = name;
  toChangeTodo.description = description;

  user
    .save()
    .then((savedUser) => {
      console.log("updated todo", todo_id);
    })
    .catch((error) => {
      console.error("Error while saving todo:", error);
    });

  res.send(toChangeTodo);
});

router.delete("/:_id/:todoId", authenticateToken, async (req, res) => {
  const userId = req.params._id;
  const todoItemId = req.params.todoId;

  const result = await Users.updateOne(
    { _id: userId },
    { $pull: { todo: { _id: todoItemId } } }
  );

  if (!result) {
    return res.status(404).send("Error while deleting todo item:", err);
  }
  res.status(200).send(result);
});

router.post("/completed", authenticateToken, async (req, res) => {
  if (!req.body.user_id) {
    return res.status(422).send({ message: "user id not found" });
  }
  if (!req.body.todo_id) {
    return res.status(422).send({ message: "todo id not found" });
  }
  if (!req.body.name) {
    return res.status(422).send({ message: "todo name not found" });
  }
  if (!req.body.description) {
    return res.status(422).send({ message: "description not found" });
  }

  const { user_id, todo_id, name, description } = req.body;

  const user = await Users.findOne({ _id: user_id });

  const todo = await Users.findOne(
    { _id: user_id },
    { todo: { $elemMatch: { _id: todo_id } } }
  ).catch((error) => {
    res.status(422).send(error);
    return;
  });

  const todoPush = {
    name: name,
    description: description,
  };

  user.completed.push(todoPush);

  const deleteTodo = await Users.updateOne(
    { _id: user_id },
    { $pull: { todo: { _id: todo_id } } }
  ).catch((error) => {
    res.status(422).send(error);
    return;
  });

  user
    .save()
    .then((savedUser) => {
      console.log("New todoItem added to user:", savedUser);
    })
    .catch((error) => {
      console.error("Error while saving user:", error);
    });

  res.status(200).send({ message: "Done!" });
});

router.get("/completed/:_id", authenticateToken, async (req, res) => {
  if (!req.params._id) {
    return res.status(422).send({ message: "user id not found" });
  }
  const user = await Users.findOne({ _id: req.params._id });
  if (!user) {
    return res.status(422).send({ message: "user not found" });
  }
  res.send(user.completed);
});

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  });
}

module.exports = router;

//64c4238a372d1a94a04db4de
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjRjNDI0NjU0ZDg0YWRlZDM4MzA3YjIwIiwiZW1haWwiOiJhZG1pMWFuYTFAZ21haWwuY29tIiwiaWF0IjoxNjkwODE0ODQwfQ.0tfq3-OrRCJ9MX2jyyuiba4UR4EIx2CY7MmHz8b65yQ
