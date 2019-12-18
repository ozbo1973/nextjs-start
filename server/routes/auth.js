/* imports */
const ctl = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const passport = require("passport");
require("dotenv").config();

/* vars and fx */
const SIGNUP_URL = "/api/signup";
const LOGIN_URL = "/api/login";
const LOGOUT_URL = "/api/logout";
const LOGOUT_ALL_URL = "/api/logoutAll";
const GOOGLE_LOGIN_URL = "/auth/google";

module.exports = app => {
  app.post(SIGNUP_URL, ctl.signup);
  app.post(LOGIN_URL, ctl.login);
  app.post(LOGOUT_URL, auth, ctl.logout);
  app.post(LOGOUT_ALL_URL, auth, ctl.logoutAll);

  app.get(
    GOOGLE_LOGIN_URL,
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app.get(
    process.env.GOOGLE_CB_URL,
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/");
    }
  );
};
