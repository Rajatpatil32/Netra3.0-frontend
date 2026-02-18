const express = require("express");
const router = express.Router();
const {
  sendRing,
  getRings
} = require("../controllers/ringController");

router.post("/", sendRing);
router.get("/:vehicleId", getRings);

module.exports = router;
