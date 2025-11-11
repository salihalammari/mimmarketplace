import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { WebflowWebhookDto } from './dto/webflow-webhook.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: createApplicationDto,
    });
  }

  async createFromWebflow(webhookData: WebflowWebhookDto) {
    // Map Webflow form fields to our database schema
    const formData = webhookData.data;
    
    // Helper function to get string value
    const getString = (key: string): string | undefined => {
      const value = formData[key];
      return typeof value === 'string' ? value : undefined;
    };

    // Helper function to get array value
    const getArray = (key: string): string[] => {
      const value = formData[key];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string' && value) return [value];
      return [];
    };

    // Helper function to get boolean value
    const getBoolean = (key: string): boolean | undefined => {
      const value = formData[key];
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'yes' || value.toLowerCase() === 'نعم' || value === 'true';
      }
      return undefined;
    };

    const applicationData: CreateApplicationDto = {
      fullName: getString('full-name') || getString('الاسم-الكامل') || '',
      email: getString('email') || getString('البريد-الالكتروني') || '',
      phone: getString('phone') || getString('whatsapp') || getString('رقم-الهاتف') || '',
      mainSalesPageLink: getString('main-sales-page') || getString('رابط-صفحة-البيع') || undefined,
      city: getString('city') || getString('المدينة') || undefined,
      productsAndBrand: getString('products-brand') || getString('المنتجات-والبراند') || undefined,
      salesCategories: getArray('sales-categories') || getArray('فئات-البيع') || [],
      imagesBelongToStore: getBoolean('images-belong-to-store') || getBoolean('هل-الصور-تنتمي') || undefined,
      productType: getString('product-type') || getString('نوع-المنتوج') || undefined,
      sellingDuration: getString('selling-duration') || getString('مدة-البيع') || undefined,
      customerFeedback: getString('customer-feedback') || getString('تعليقات-الزبائن') || undefined,
      returnHandling: getString('return-handling') || getString('إرجاع-السلعة') || undefined,
      fakeOrdersExperience: getString('fake-orders') || getString('طلبات-مزيفة') || undefined,
      shippingTime: getString('shipping-time') || getString('مدة-الشحن') || undefined,
      deliveryArea: getString('delivery-area') || getString('منطقة-التوصيل') || undefined,
      badgeUsageLocations: getArray('badge-usage') || getArray('استعمال-البادج') || [],
    };

    return this.create(applicationData);
  }

  async findAll() {
    return this.prisma.application.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.application.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'qualified' || status === 'badge_activated') {
      updateData.reviewedAt = new Date();
    }

    if (status === 'badge_activated') {
      updateData.badgeActivatedAt = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    return this.prisma.application.update({
      where: { id },
      data: updateData,
    });
  }
}

