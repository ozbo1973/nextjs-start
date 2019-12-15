/* imports */
const jwt = require("jsonwebtoken");
const Users = require("../models/user.schema");
require("dotenv").config();

/* vars and fx */
const MSG_MUST_AUTH = "You must be logged in.";
const AUTH_HEADER = "Authorization";
const AUTH_TYPE = "Bearer ";

const auth = async (req, res, next) => {
  try {
    const token = req.header(AUTH_HEADER).replace(AUTH_TYPE, "");
    const jwtVerify = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne(
      { _id: jwtVerify._id, "tokens.token": token },
      "email username _id tokens"
    );

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.userToken = token;
    next();
  } catch (error) {
    res.status(401).send({ errMsg: MSG_MUST_AUTH });
  }
};

module.exports = auth;
