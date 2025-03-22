const { connectDB } = require("../config/db");

async function testConnection() {
  await connectDB();
}

testConnection();
