require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  console.log('🔍 Testing database connection...');
  console.log('📍 Connection URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📊 Available tables:', tables.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check if your DATABASE_URL in .env has the COMPLETE password (not truncated)');
      console.log('2. Verify the connection string format:');
      console.log('   postgresql://postgres.PROJECT_REF:COMPLETE_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require');
      console.log('3. Make sure your Supabase database is running');
      console.log('4. Check if your network/firewall allows connections to Supabase');
    }
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Password issue detected!');
      console.log('   Make sure your DATABASE_URL has the complete password, not "Sali2991..."');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

