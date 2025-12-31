function getNowMs(req) {
  if (process.env.TEST_MODE === "1") {
    const headerNow = req.headers["x-test-now-ms"];
    if (headerNow) {
      const parsed = Number(headerNow);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}

module.exports = { getNowMs };
