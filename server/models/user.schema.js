/* imports */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* vars and FX */
const MSG_UNABLE_LOGIN = "Unable to login";
const MSG_MISSING_REQUIRED_FIELDS =
  "You must input email, username and password.";
const MSG_MISSING_LOGIN_FIELDS = "You must input username and password";
const hasExistingUserMsg = ({ email, username }) =>
  `The following has already been used: ${email ? "email: " + email : ""} ${
    username ? "username: " + username : ""
  }`;

/* Schema model */
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, lowercase: true, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

/* methods */
userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.logout = async function(devices) {
  const user = this;
  if (devices === "all") {
    user.tokens = [];
  } else {
    user.tokens = user.tokens.filter(t => t.token !== token);
  }
  await user.save();
};

/* hooks */
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

/* statics */
userSchema.statics.hasExistingUser = async ({ email, username }) => {
  const existingUser = await Users.findOne({
    $or: [{ email }, { username }]
  });

  if (!existingUser) {
    return null;
  }

  const match = {};
  match.email = email === existingUser.email ? email : null;
  match.username = username === existingUser.username ? username : null;
  return hasExistingUserMsg(match);
};

userSchema.statics.createNewUser = async newUser => {
  const { email, username, password } = newUser;
  if (!email || !username || !password) {
    return { status: 422, user: null, errMsg: MSG_MISSING_REQUIRED_FIELDS };
  }
  const existingUser = await Users.hasExistingUser(newUser);

  if (existingUser) {
    return { status: 406, user: null, errMsg: existingUser };
  }

  const user = await Users.create(newUser);
  const token = await user.generateAuthToken();
  return { status: 201, user, token, errMsg: null };
};

userSchema.statics.updateUser = async (changes, userId) => {
  const user = await Users.findByIdAndUpdate(userId, changes, { new: true });
  if (!user) {
    throw new Error();
  }
  return user;
};

userSchema.statics.deleteUser = async user => await user.remove();

userSchema.statics.findByCreds = async (username, password) => {
  if (!username || !password) {
    throw new Error(MSG_MISSING_LOGIN_FIELDS);
  }

  const user = await Users.findOne({ username });

  if (!user) {
    throw new Error(MSG_UNABLE_LOGIN);
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(MSG_UNABLE_LOGIN);
  }

  return user;
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
