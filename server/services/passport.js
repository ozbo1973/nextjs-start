const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

/* vars and fx */
const GOOGLE_CALLBACK_URL = "/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CB_URL,
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      console.log("requser: ", req.user);
      console.log("profile: ", profile);
    }
  )
);
