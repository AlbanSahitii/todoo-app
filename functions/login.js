const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("./src/model/model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "../../.env" });

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
//Using secret_key here for testing purpose
const SECRET_KEY = "Alban";

exports.handler = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email: email }).catch((err) =>
    res.send(err)
  );

  if (!user) {
    return res
      .status(409)
      .send({ message: "Email and/or password is invalid" });
  }

  const checkPassword = await verifyPassword(password, user.password);

  if (!checkPassword) {
    res.status(400).send({ message: "Email and/or password is invalid" });
  }

  const payload = {
    user_id: user._id,
    email: email,
  };
  const token = jwt.sign(payload, SECRET_KEY);

  res.cookie("jwt", token, { httpOnly: true });
  res.status(200).send({ message: "Loggin Sucessfully", jwt: token });
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
