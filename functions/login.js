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
  console.log(`getting data from body`);
  const body = JSON.parse(event.body);
  console.log(`saving data from body`);
  const { email, password } = body;
  console.log(`Starting to connect to db`);
  const user = await Users.findOne({ email: email }).catch((err) => {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: err }),
    };
  });

  console.log(`done got user`);
  if (!user) {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }

  console.log(`checking pww`);
  const checkPassword = await verifyPassword(password, user.password);

  if (!checkPassword) {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }

  console.log(`sending payload`);
  const payload = {
    user_id: user._id,
    email: email,
  };
  // const token = jwt.sign(payload, SECRET_KEY);

  console.log(`returnin good`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Logged in succefully", jwt: jwt }),
    // headers: {
    //   "Set-Cookie": `jwt=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`, // Set the cookie with HttpOnly and Secure flags
    // },
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
