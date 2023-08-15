const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("./src/model/model");
const jwt = require("jsonwebtoken");
require("./api");

const header = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Max-Age": "2592000",
  "Access-Control-Allow-Credentials": "true",
};

const authenticateToken = (headers, secretKey) => {
  const authorizationHeader = headers.authorization;

  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    try {
      // Verify the JWT token using the provided secret key
      const decoded = jwt.verify(token, secretKey);
      return decoded; // Return the decoded token payload
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return null; // Token verification failed
    }
  }

  return null;
};

exports.handler = async (event, context) => {
  const SECRET_KEY = "Alban";
  console.log(`jwtauth function call`);
  const jwtAuth = authenticateToken(event.headers, SECRET_KEY);

  console.log(`jwtauth validation`);
  if (!jwtAuth) {
    return {
      statusCode: 401,
      header: header,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const body = JSON.parse(event.body);
  const { _id, todo_id, name, description } = body;

  if (!_id) {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify({ message: "user id not found" }),
    };
  }
  if (!todo_id) {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify({ message: "todo id not found" }),
    };
  }
  if (!name) {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify({ message: "todo name not found" }),
    };
  }
  if (!description) {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify({ message: "description not found" }),
    };
  }

  const user = await Users.findOne({ _id: _id });

  const todo = await Users.findOne(
    { _id: _id },
    { todo: { $elemMatch: { _id: todo_id } } }
  ).catch((error) => {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify(error),
    };
  });

  const todoPush = {
    name: name,
    description: description,
  };

  user.completed.push(todoPush);

  const deleteTodo = await Users.updateOne(
    { _id: _id },
    { $pull: { todo: { _id: todo_id } } }
  ).catch((error) => {
    return {
      statusCode: 422,
      header: header,
      body: JSON.stringify(error),
    };
  });

  user
    .save()
    .then((savedUser) => {
      console.log("New todoItem added to user:", savedUser);
    })
    .catch((error) => {
      console.error("Error while saving user:", error);
    });

  return {
    statusCode: 200,
    header: header,
    body: JSON.stringify({ message: "Done!" }),
  };
};
