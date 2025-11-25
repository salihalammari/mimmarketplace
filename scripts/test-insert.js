const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testInsert() {
  try {
    const timestamp = Date.now();
    const testData = {
      full_name: 'Test User',
      email: `test.user.${timestamp}@example.com`,
      phone: '+212612345678',
      category: 'electronics',
      language: 'en',
      submitted_fields: {
        city: 'Casablanca',
        productsAndBrand: 'Testing Goods',
        salesCategories: ['electronics', 'home'],
        imagesBelongToStore: true,
        productType: 'imported',
        sellingDuration: '3-6 months',
        customerFeedback: 'yes often',
        returnHandling: 'Handled by seller',
        fakeOrdersExperience: 'no',
        shippingTime: '1-2 days',
        deliveryArea: 'All Morocco',
        badgeUsageLocations: ['website', 'social'],
      },
    };

    console.log('Inserting test data...');
    const created = await prisma.applications.create({
      data: testData,
    });

    console.log('✅ Data inserted successfully!');
    console.log('\nCreated Application:');
    console.log(`  ID: ${created.id}`);
    console.log(`  Full Name: ${created.full_name}`);
    console.log(`  Email: ${created.email}`);
    console.log(`  Phone: ${created.phone}`);
    console.log(`  Category: ${created.category}`);
    console.log(`  Language: ${created.language}`);
    console.log(`  Status: ${created.status}`);
    console.log(`  Created At: ${created.created_at}`);
    console.log(`  Updated At: ${created.updated_at}`);
    console.log(`  Submitted Fields: ${JSON.stringify(created.submitted_fields, null, 2)}`);

    console.log('\n🔍 Verifying data was saved...');
    const retrieved = await prisma.applications.findUnique({
      where: { id: created.id },
    });

    if (retrieved) {
      console.log('✅ Data successfully retrieved from database!');
      console.log(`  Retrieved Full Name: ${retrieved.full_name}`);
      console.log(`  Retrieved Email: ${retrieved.email}`);
    } else {
      console.log('❌ Data not found in database!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testInsert();

