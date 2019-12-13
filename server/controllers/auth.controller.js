const HAS_EXISTING_USER = "The following has already been used: ";
const MISSING_REQUIRE_FIELD = "You must input email, username and password.";

/* imports */
const User = require("../models/user.schema");

/* conrollers */
exports.getAlllxxx = async (req, res) => {};

exports.signup = async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !passsword) {
    return res.status(422).json({ errMsg: MISSING_REQUIRE_FIELD });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      return res.status(406).json({
        errMsg: `${HAS_EXISTING_USER} ${existingUser.email &&
          "email: " + existingUser.email} ${existingUser.username &&
          "username: " + existingUser.username}`
      });
    }

    const newUser = await User.create({ email, username, password });
    res.json({ newUser });
  } catch (error) {
    res.send(500).json({ errMsg: error });
  }
};

exports.createXXX = async (req, res) => {};

exports.updateXXX = async (req, res) => {};

exports.deleteLinksDocs = async (req, res) => {};

module.exports = exports;
