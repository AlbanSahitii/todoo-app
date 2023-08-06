const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../model/model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const SECRET_KEY = "Alban";

async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.error("Error while hashing password:", err);
    throw err;
  }
}

exports.handler = async (event, context) => {
  const { full_name, email, password, confirmPassword } = event;
  const result = await Users.findOne({ email: email }).catch((err) =>
    res.send(err)
  );

  if (result) {
    return {
      statusCode: 409,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Already exists" }),
    };
  }

  if (password !== confirmPassword) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Password don`t match" }),
    };
  }

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    event.password = await hashPassword(password);
    const userCreate = await Users.create(event).catch((err) => {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(err),
      };
    });

    res.status(200).send({ message: "Registred Succesfully" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Registred Succesfully" }),
    };
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }
};
