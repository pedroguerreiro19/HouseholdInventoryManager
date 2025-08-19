require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const rateLimiter = require('./src/middlewares/rateLimiter');

const familyRoutes = require('./src/routes/groupRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/items', itemRoutes);
app.use("/api/groups", familyRoutes);
app.use('/api/users', userRoutes);

app.use("/api/users/login", rateLimiter);
app.use("/api/users/create", rateLimiter);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
