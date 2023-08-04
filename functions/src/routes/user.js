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

router.post("/register", async (req, res) => {
  const { full_name, email, password, confirmPassword } = req.body;
  const result = await Users.findOne({ email: email }).catch((err) =>
    res.send(err)
  );

  if (result) {
    return res.status(409).send({ message: "Already exists" });
  }

  if (password !== confirmPassword) {
    return res.status(401).send({ message: "Password don`t match" });
  }

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    req.body.password = await hashPassword(password);

    const userCreate = await Users.create(req.body).catch((err) => {
      return res.send(err);
    });

    res.status(200).send({ message: "Registred Succesfully" });
  } else {
    return res
      .status(400)
      .send({ message: "Email and/or password is invalid" });
  }
});

router.post("/login", async (req, res) => {
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
});

async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.error("Error while hashing password:", err);
    throw err;
  }
}

async function verifyPassword(userPassword, storedHash) {
  try {
    const isPasswordMatch = await bcrypt.compare(userPassword, storedHash);
    return isPasswordMatch;
  } catch (err) {
    console.error("Error while verifying password:", err);
    throw err;
  }
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  });
}

module.exports = router;
