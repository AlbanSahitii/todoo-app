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

exports.handler = async (event, context) => {
  console.log(`getting data from body`);
  const body = JSON.parse(event.body);
  console.log(`saving data from body`);
  const { _id, name, description } = body;

  if (!_id) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "user id not found" }),
    };
  }
  if (!name) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "todo name not found" }),
    };
  }
  if (!description) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "description not found" }),
    };
  }

  const newToDo = {
    name: name,
    description: description,
  };

  const user = await Users.findOne({ _id: _id }).catch((err) => res.send(err));
  if (!user) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "user not found" }),
    };
  }

  user.todo.push(newToDo);

  user
    .save()
    .then((savedUser) => {
      return console.log("New todoItem added to user:", savedUser);
    })
    .catch((error) => {
      return console.error("Error while saving user:", error);
    });

  return {
    statusCode: 200,
    headers: header,
    body: JSON.stringify(user),
  };
};
