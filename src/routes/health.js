const express = require("express");
const redis = require("../db/redis");

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await redis.ping();
    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({ ok: false });
  }
});

module.exports = router;
