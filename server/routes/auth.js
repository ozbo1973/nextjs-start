/* ### Chnage the routes and url param vars */
const SIGNUP_URL = "/api/signup";
const ctl = require("../controllers/auth.controller");

/* Error handler for async / await functions */
const catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

module.exports = app => {
  app.post(SIGNUP_URL, ctl.signup);
};
