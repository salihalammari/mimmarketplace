const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function dropTables() {
  try {
    console.log('Dropping existing tables...');
    
    // Drop tables in correct order (respecting foreign key constraints)
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.verifications CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.badges CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.audit_logs CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.applications CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.sellers CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS public.profiles CASCADE;');
    
    console.log('Tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

dropTables();

