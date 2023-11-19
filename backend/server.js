const app = require("./app");
const colors = require("colors");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} `.yellow.bold);
});
