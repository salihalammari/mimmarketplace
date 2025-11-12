import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

describe('ApplicationsService (integration)', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;
  let createdApplicationId: string | undefined;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationsService, PrismaService],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Ensure the database connection is ready before tests run
    await prisma.$connect();
  });

  afterAll(async () => {
    if (createdApplicationId) {
      await prisma.applications.delete({
        where: { id: createdApplicationId },
      });
    }

    await prisma.$disconnect();
  });

  it('should persist application data in the database', async () => {
    const timestamp = Date.now();
    const createDto: CreateApplicationDto = {
      seller_name: 'Test User',
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

    const created = await service.create(createDto);
    createdApplicationId = created.id;

    expect(created).toMatchObject({
      seller_name: createDto.seller_name,
      email: createDto.email,
      phone: createDto.phone,
      category: createDto.category,
      language: createDto.language,
    });

    expect(created.submitted_fields).toMatchObject(createDto.submitted_fields);

    const persisted = await prisma.applications.findUnique({
      where: { id: created.id },
    });

    expect(persisted).not.toBeNull();
    expect(persisted).toMatchObject({
      seller_name: createDto.seller_name,
      email: createDto.email,
      phone: createDto.phone,
      category: createDto.category,
      language: createDto.language,
    });

    expect(persisted?.submitted_fields).toMatchObject(createDto.submitted_fields);
  });
});

