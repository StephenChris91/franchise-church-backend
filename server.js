const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client"); // ✅ Add this
const socket = require("./src/socketSetup/socketSetup");
const index = require("./src/index");

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to DB");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  }
}

connectToDB();

const PORT = process.env.PORT || 5000;
const socketApp = index.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

socket(socketApp, prisma);
