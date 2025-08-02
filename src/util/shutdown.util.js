import prisma from "../config/prisma.config.js";

const shutdown = async (signal) => {
  console.log(`\nReceive ${signal}, shutting down gracefully...`);
  try {
    // Close database connections
    await prisma.$disconnect();
    console.log("Database connections closed.");
  } catch (error) {
    console.error("Error closing database connections:", error);
  }
};

export default shutdown;
