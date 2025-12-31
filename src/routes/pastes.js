const express = require("express");
const { isNonEmptyString, isPositiveInteger } = require("../utils/validate");
const { httpError } = require("../errors/httpsErrors");
const { createPaste } = require("../services/pasteService");
const { getNowMs } = require("../services/time");

const router = express.Router();

router.post("/pastes", async (req, res, next) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!isNonEmptyString(content)) {
      throw httpError(400, "Invalid content");
    }

    if (
      ttl_seconds !== undefined &&
      !isPositiveInteger(ttl_seconds)
    ) {
      throw httpError(400, "Invalid ttl_seconds");
    }

    if (
      max_views !== undefined &&
      !isPositiveInteger(max_views)
    ) {
      throw httpError(400, "Invalid max_views");
    }

    const nowMs = getNowMs(req);

    const paste = await createPaste({
      content,
      ttlSeconds: ttl_seconds,
      maxViews: max_views,
      nowMs,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      id: paste.id,
      url: `${baseUrl}/p/${paste.id}`,
    });
  } catch (err) {
    next(err);
  }
});

const {
  fetchAndConsumePaste,
} = require("../services/pasteService");

router.get("/pastes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const nowMs = getNowMs(req);

    const result = await fetchAndConsumePaste(id, nowMs);

    if (result.status !== "ok") {
      return res.status(404).json({ error: "Paste not found" });
    }

    const paste = result.paste;

    const remainingViews =
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views_used, 0);

    res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
