const express = require("express");
const router = express.Router();
const {
  createRing,
  getAllRings,
  updateRingStatus
} = require("../controllers/ringController");

router.post("/", createRing);
router.get("/", getAllRings);
router.put("/:id/status", updateRingStatus);

module.exports = router;
