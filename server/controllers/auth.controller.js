/* imports */
const Users = require("../models/user.schema");

/* vars and fx */
const MSG_LOGGED_OUT = "You have successfully logged out on this device.";
const MSG_LOGGED_OUT_ALL = "You have successfully logged out of all devices.";

/* conrollers */
exports.signup = async (req, res, next) => {
  try {
    const newUser = await Users.createUser_JWT(req.body);
    const { status, user, token, errMsg } = newUser;

    if (!user) {
      return res.status(status).send({ errMsg });
    }

    res.status(status).send({ user, token });
  } catch (error) {
    res.status(400).send({ errMsg: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await Users.findByCreds(req.body.username, req.body.password);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ errMsg: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    await req.user.logout(req.userToken);
    res.status(200).send({ msg: MSG_LOGGED_OUT });
  } catch (error) {
    res.status(400).send({ errMsg: error.message });
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    await req.user.logout("all");
    res.status(200).send({ msg: MSG_LOGGED_OUT_ALL });
  } catch (error) {
    res.status(400).send({ errMsg: error.message });
  }
};

module.exports = exports;
