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
};
