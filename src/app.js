const express = require("express");
const healthRoutes = require("./routes/health");
const pasteRoutes = require("./routes/pastes");
const viewRoutes = require("./routes/view");
const cors = require("cors")


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", viewRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
