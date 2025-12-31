const redis = require("../db/redis");
const { nanoid } = require("nanoid");

const PASTE_PREFIX = "paste:";

function getKey(id) {
  return `${PASTE_PREFIX}${id}`;
}

async function createPaste({ content, ttlSeconds, maxViews, nowMs }) {
  const id = nanoid(10);

  const expiresAt =
    ttlSeconds != null ? nowMs + ttlSeconds * 1000 : null;

  const paste = {
    id,
    content,
    created_at: nowMs,
    expires_at: expiresAt,
    max_views: maxViews ?? null,
    views_used: 0,
  };

  await redis.set(getKey(id), JSON.stringify(paste));

  return paste;
}

async function getPaste(id) {
  const raw = await redis.get(getKey(id));
  if (!raw) return null;
  return JSON.parse(raw);
}

async function savePaste(paste) {
  await redis.set(getKey(paste.id), JSON.stringify(paste));
}

function isExpired(paste, nowMs) {
  return paste.expires_at !== null && nowMs >= paste.expires_at;
}

function isViewLimitExceeded(paste) {
  return (
    paste.max_views !== null &&
    paste.views_used >= paste.max_views
  );
}

async function fetchAndConsumePaste(id, nowMs) {
  const key = getKey(id);

  const raw = await redis.get(key);
  if (!raw) return { status: "not_found" };

  const paste = JSON.parse(raw);

  if (isExpired(paste, nowMs)) {
    return { status: "unavailable" };
  }

  if (isViewLimitExceeded(paste)) {
    return { status: "unavailable" };
  }

  // consume a view
  paste.views_used += 1;

  await redis.set(key, JSON.stringify(paste));

  return { status: "ok", paste };
}


module.exports = {
  createPaste,
  getPaste,
  savePaste,
  fetchAndConsumePaste,
};
