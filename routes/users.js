const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
  findUser,
  editUser
} = require("../controllers/users");
const {
  checkToken,
  checkPasswordToken
} = require("../controllers/token_middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/check-token", checkToken);
router.get("/check-password-token", checkPasswordToken);
router.get("/find-user", checkToken, findUser);
router.put("/reset-password", resetPassword);
router.patch("/edit/:id", editUser);

module.exports = router;
