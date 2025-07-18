// server.js
const app = require("./src/index");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
  }
}

start();
