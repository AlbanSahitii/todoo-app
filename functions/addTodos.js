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

  console.log(`validating`, body);
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
  console.log(`saving todo to newtodo ${newToDo}`);

  const user = await Users.findOne({ _id: _id }).catch((err) => res.send(err));
  if (!user) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "user not found" }),
    };
  }

  console.log(`finding user ${user}`);

  user.todo.push(newToDo);

  console.log(`saving user ${user}`);

  try {
    const savedUser = await user.save();
    console.log("New todoItem added to user:", savedUser);
  } catch (error) {
    console.error("Error while saving user:", error);
  }

  console.log(`saved`);
  return {
    statusCode: 200,
    headers: header,
    body: JSON.stringify(user),
  };
};
