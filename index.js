require("dotenv").config();
const app = require("./src/app");
const cors = require("cors");
app.use(cors());


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
