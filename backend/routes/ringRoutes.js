const express = require("express");
const router = express.Router();

const {
  createRingRequest
} = require("../controllers/ringController");


router.post("/", createRingRequest);


module.exports = router;