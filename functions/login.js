const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("./src/model/model");
const jwt = require("jsonwebtoken");
require("./api");
//Using secret_key here for testing purpose
const SECRET_KEY = "Alban";

exports.handler = async (event, context) => {
  console.log(`getting data from body`);
  const body = JSON.parse(event.body);
  console.log(`saving data from body`);
  const { email, password } = body;

  console.log(`Starting to connect to db`);

  const user = await Users.findOne({ email: email })
    .then(async (data) => {
      console.log("Data : ", data);

      console.log("user. ", data);
      console.log("data.password ", data.password);
      console.log("password ", password);

      console.log(`done got data`);
      if (!data) {
        console.log(`data invalid`);
        return {
          statusCode: 409,
          body: JSON.stringify({ message: "Email and/or password is invalid" }),
        };
      }

      console.log(`checking pww`);
      const isPasswordMatch = await bcrypt.compare(password, data.password);

      if (!isPasswordMatch) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: "Email and/or password is invalid" }),
        };
      }

      console.log(`sending payload`);

      const payload = {
        data_id: data._id,
        email: email,
      };
      const token = jwt.sign(payload, SECRET_KEY);
      return { token: token, _id: data._id };
    })
    .catch((error) => ({ statusCode: 422, body: String(error) }));
  console.log(`returnin good`);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "2592000",
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(user),
  };
};
