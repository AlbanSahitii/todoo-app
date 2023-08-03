const bcrypt = require("bcrypt");
const Users = require("../model/model.js");
const jwt = require("jsonwebtoken");

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
//Using secret_key here for testing purpose
const SECRET_KEY = "Alban";

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.error("Error while hashing password:", err);
    throw err;
  }
};

const verifyPassword = async (userPassword, storedHash) => {
  try {
    const isPasswordMatch = await bcrypt.compare(userPassword, storedHash);
    return isPasswordMatch;
  } catch (err) {
    console.error("Error while verifying password:", err);
    throw err;
  }
};

const login = async (event, context) => {
  const { email, password } = JSON.parse(event.body);
  const user = await Users.findOne({ email: email }).catch((err) =>
    res.send(err)
  );

  if (!user) {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }

  const checkPassword = await verifyPassword(password, user.password);

  if (!checkPassword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }

  const payload = {
    user_id: user._id,
    email: email,
  };
  const token = jwt.sign(payload, SECRET_KEY);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Loggin Successfully", jwt: token }),
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `jwt=${token}; HttpOnly; Path=/`,
    },
  };
};

const register = async (event, context) => {
  const { full_name, email, password, confirmPassword } = JSON.parse(
    event.body
  );
  const result = await Users.findOne({ email: email }).catch((err) =>
    res.send(err)
  );

  if (result) {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "Already exists" }),
    };
  }

  if (password !== confirmPassword) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Password don't match" }),
    };
  }

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    const hashedPassword = await hashPassword(password);

    const newUser = new Users({
      full_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registered Successfully" }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and/or password is invalid" }),
    };
  }
};

module.exports = {
  login,
  register,
};
