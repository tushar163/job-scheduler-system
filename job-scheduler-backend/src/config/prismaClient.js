// src/config/prismaClient.js
const { PrismaClient } = require('@prisma/client');

// Simple configuration for Prisma 5
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Test connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;