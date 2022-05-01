const express = require("express");
const { checkToken } = require("../controllers/token_middleware");
const { checkAdmin } = require("../controllers/users_middleware");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  show
} = require("../controllers/vaccine");

router.use(express.json());

router.get("/", index);

router.post("/create", checkToken, checkAdmin, create);

router.put("/update/:id", checkToken, checkAdmin, update);

router.delete("/delete/:id", checkToken, checkAdmin, destroy);

router.get("/:id", show);

module.exports = router;
