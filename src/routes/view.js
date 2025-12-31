const express = require("express");
const { fetchAndConsumePaste } = require("../services/pasteService");
const { getNowMs } = require("../services/time");
const { escapeHtml } = require("../utils/escapeHtml");

const router = express.Router();

router.get("/p/:id", async (req, res) => {
  const { id } = req.params;
  const nowMs = getNowMs(req);

  const result = await fetchAndConsumePaste(id, nowMs);

  if (result.status !== "ok") {
    return res.status(404).send("404 Not Found");
  }

  const paste = result.paste;

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Paste</title>
      </head>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

module.exports = router;
