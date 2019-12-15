/* imports */
const ctl = require("../controllers/profile.controller");
const auth = require("../middlewares/auth.middleware");

/* vars and fx */
const MY_PROFILE_URL = "/api/users/myprofile";

module.exports = app => {
  app.get(MY_PROFILE_URL, auth, ctl.myProfile);
  app.patch(MY_PROFILE_URL, auth, ctl.editProfile);
  app.delete(MY_PROFILE_URL, auth, ctl.deleteProfile);
};
