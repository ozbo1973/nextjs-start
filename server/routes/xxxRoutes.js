const express = require("express");
const ctl = require("../controllers/xxxControllers");

//route = /api/xxx
var router = express.Router();
router
  .route("/:var1/:var2")
  .get(ctl.getAllxxx)
  .post(ctl.createXXX);

router
  .route("/:var1/:var2/:id")
  .get(ctl.getXXX)
  .patch(ctl.updateXXX)
  .delete(ctl.deleteXXX);

module.exports = router;
