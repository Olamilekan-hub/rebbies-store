#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔌 Testing PostgreSQL connection...\n');
  
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 PostgreSQL version:', result[0].version);
    
    console.log('\n🎉 Connection test passed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Check your DATABASE_URL is correct');
      console.log('2. Ensure your PostgreSQL database is running');
      console.log('3. Check your network connectivity');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
