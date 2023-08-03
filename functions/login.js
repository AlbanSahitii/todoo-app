const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("./src/model/model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "../../.env" });

//Using secret_key here for testing purpose
const SECRET_KEY = "Alban";

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const { email, password } = body;
  // const user = await Users.findOne({ email: email }).catch((err) =>
  //   res.send(err)
  // );

  // if (!user) {
  //   return {
  //     statusCode: 409,
  //     body: JSON.stringify({ message: "Email and/or password is invalid" }),
  //   };
  // }

  // const checkPassword = await verifyPassword(password, user.password);

  // if (!checkPassword) {
  //   return {
  //     statusCode: 409,
  //     body: JSON.stringify({ message: "Email and/or password is invalid" }),
  //   };
  // }

  // const payload = {
  //   user_id: user._id,
  //   email: email,
  // };
  // const token = jwt.sign(payload, SECRET_KEY);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `${email} ${password}` }),
  };
};

async function verifyPassword(userPassword, storedHash) {
  try {
    const isPasswordMatch = await bcrypt.compare(userPassword, storedHash);
    return isPasswordMatch;
  } catch (err) {
    console.error("Error while verifying password:", err);
    throw err;
  }
}
