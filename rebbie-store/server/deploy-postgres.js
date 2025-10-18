#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function deployToPostgres() {
  console.log('🚀 Starting PostgreSQL deployment...\n');
  
  try {
    // Step 1: Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    await execAsync('npx prisma generate');
    console.log('✅ Prisma Client generated\n');
    
    // Step 2: Reset and deploy database (since we're switching from MySQL to PostgreSQL)
    console.log('🗄️ Deploying database schema...');
    
    // For production deployment, we use db push instead of migrate deploy
    // when switching database providers
    await execAsync('npx prisma db push --force-reset');
    console.log('✅ Database schema deployed\n');
    
    // Step 3: Insert demo data
    console.log('📊 Inserting demo data...');
    await execAsync('node utills/insertDemoData.js');
    console.log('✅ Demo data inserted\n');
    
    console.log('🎉 Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    // If the error is about missing tables, try a different approach
    if (error.message.includes('does not exist')) {
      console.log('\n🔄 Trying alternative deployment method...');
      
      try {
        // Create a new migration for PostgreSQL
        console.log('📝 Creating new PostgreSQL migration...');
        await execAsync('npx prisma migrate dev --name init_postgresql --create-only');
        
        console.log('🗄️ Deploying migration...');
        await execAsync('npx prisma migrate deploy');
        
        console.log('📊 Inserting demo data...');
        await execAsync('node utills/insertDemoData.js');
        
        console.log('🎉 Alternative deployment completed successfully!');
        
      } catch (secondError) {
        console.error('❌ Alternative deployment also failed:', secondError.message);
        console.log('\n💡 Manual steps required:');
        console.log('1. Check your DATABASE_URL is correct');
        console.log('2. Ensure PostgreSQL database is accessible');
        console.log('3. Try running: npx prisma db push --force-reset');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

deployToPostgres();
