const mongoose = require("mongoose");
require("dotenv").config();

// Support both MONGO_URI (Vercel standard) and MongoDB_URL (existing)
const mongoUri = process.env.MONGO_URI || process.env.MongoDB_URL;

if (!mongoUri) {
  console.error("MongoDB connection string not found. Please set MONGO_URI or MongoDB_URL in environment variables.");
}

const connection = mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
