const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");

const { checkToken } = require("../controllers/token_middleware");
const { checkAdmin } = require("../controllers/users_middleware");

//staff
router.get("/staff", admin.staffs);
router.get("/users", checkToken, checkAdmin, admin.allUsers);
router.get("/user/:id", checkToken, checkAdmin, admin.getUserInfo);
router.get("/appointments", checkToken, checkAdmin, admin.allAppointments);

router.post("/add_staff", checkToken, checkAdmin, admin.addStaff);
router.get("/edit_staff/:id", checkToken, checkAdmin, admin.editStaff);
router.put("/update_staff/:id", checkToken, checkAdmin, admin.updateStaff);
router.delete("/delete_staff/:id", checkToken, checkAdmin, admin.deleteStaff);

module.exports = router;
