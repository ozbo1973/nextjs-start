/* imports */
const Users = require("../models/user.schema");

/* vars and fx */
const MSG_DELETED_USER = "You have successfully deleted your account";

/* controllers */
exports.myProfile = async (req, res, next) => {
  res.send(req.user);
};

exports.editProfile = async (req, res, next) => {
  const body = req.body;
  const changes = Object.keys(body).reduce((acc, obj) => {
    if (body[obj]) {
      acc[obj] = body[obj];
    }
    return acc;
  }, {});

  try {
    const user = await Users.updateUser(changes, req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ errMsg: error.message });
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await Users.deleteUser(req.user);
    res.status(200).send({ user: req.user, msg: MSG_DELETED_USER });
  } catch (error) {
    res.status(500).send({ errMsg: error.message });
  }
};

module.exports = exports;
