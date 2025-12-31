const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("ready", () => {
  console.log("Redis ready");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Redis initial connection failed", err);
  }
})();

module.exports = client;
