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
  console.log(headers, "  auth function");

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
      header: headers,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  console.log(`jwtauth validation done`);
  console.log(`getting data from body`);
  const body = JSON.parse(event.body);
  console.log(`saving data from body`);
  const { _id } = body;
  if (!_id) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "user id not found" }),
    };
  }
  console.log(`id request found`);
  const user = await Users.findOne({ _id: _id });
  console.log(`user found`);
  if (!user) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: "user not found" }),
    };
  }
  return {
    statusCode: 200,
    headers: header,
    body: JSON.stringify(user.todo),
  };
};
