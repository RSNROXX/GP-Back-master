const express = require("express");
const router = express.Router();
const { index, update } = require("../controllers/about");

router.use(express.json());

router.get("/", index);

router.put("/update/:id", update);

module.exports = router;
