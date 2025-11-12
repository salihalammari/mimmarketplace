const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyData() {
  try {
    const applications = await prisma.applications.findMany({
      orderBy: { created_at: 'desc' },
      take: 3,
    });
    
    console.log(`Found ${applications.length} application(s):\n`);
    applications.forEach((app, index) => {
      console.log(`Application ${index + 1}:`);
      console.log(`  ID: ${app.id}`);
      console.log(`  Seller Name: ${app.seller_name}`);
      console.log(`  Email: ${app.email}`);
      console.log(`  Category: ${app.category}`);
      console.log(`  Language: ${app.language}`);
      console.log(`  Status: ${app.status}`);
      console.log(`  Created At: ${app.created_at}`);
      if (app.submitted_fields) {
        console.log(`  Submitted Fields: ${JSON.stringify(app.submitted_fields, null, 2)}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error verifying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();

