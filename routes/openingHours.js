const express = require("express");
const router = express.Router();
const { index, show, update } = require("../controllers/openingHours");
const { checkToken } = require("../controllers/token_middleware");
const { checkAdmin } = require("../controllers/users_middleware");

router.use(express.json());

router.get("/", index);

router.post("/show", checkToken, checkAdmin, show);

router.put("/update", checkToken, checkAdmin, update);

module.exports = router;
