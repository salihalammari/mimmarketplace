import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { WebflowWebhookDto } from './dto/webflow-webhook.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.applications.create({
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

    // Extract core required fields
    const sellerName = getString('full-name') || getString('الاسم-الكامل') || '';
    const email = getString('email') || getString('البريد-الالكتروني') || '';
    const phone = getString('phone') || getString('whatsapp') || getString('رقم-الهاتف') || undefined;
    
    // Determine category and language (you may need to adjust this logic)
    const category = getString('category') || getString('فئة') || 'general';
    const language = getString('language') || 'en';

    // Store all other fields in submitted_fields as JSON
    const submittedFields: Record<string, any> = {
      mainSalesPageLink: getString('main-sales-page') || getString('رابط-صفحة-البيع'),
      city: getString('city') || getString('المدينة'),
      productsAndBrand: getString('products-brand') || getString('المنتجات-والبراند'),
      salesCategories: getArray('sales-categories') || getArray('فئات-البيع'),
      imagesBelongToStore: getBoolean('images-belong-to-store') || getBoolean('هل-الصور-تنتمي'),
      productType: getString('product-type') || getString('نوع-المنتوج'),
      sellingDuration: getString('selling-duration') || getString('مدة-البيع'),
      customerFeedback: getString('customer-feedback') || getString('تعليقات-الزبائن'),
      returnHandling: getString('return-handling') || getString('إرجاع-السلعة'),
      fakeOrdersExperience: getString('fake-orders') || getString('طلبات-مزيفة'),
      shippingTime: getString('shipping-time') || getString('مدة-الشحن'),
      deliveryArea: getString('delivery-area') || getString('منطقة-التوصيل'),
      badgeUsageLocations: getArray('badge-usage') || getArray('استعمال-البادج'),
    };

    // Remove undefined values
    Object.keys(submittedFields).forEach(key => {
      if (submittedFields[key] === undefined) {
        delete submittedFields[key];
      }
    });

    const applicationData: CreateApplicationDto = {
      seller_name: sellerName,
      email,
      phone,
      category,
      language,
      submitted_fields: Object.keys(submittedFields).length > 0 ? submittedFields : undefined,
    };

    return this.create(applicationData);
  }

  async findAll() {
    return this.prisma.applications.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.applications.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const updateData: any = {
      status,
    };

    if (notes) {
      // Store notes in submitted_fields or create a separate field if needed
      const existing = await this.prisma.applications.findUnique({ where: { id } });
      const submittedFields = existing?.submitted_fields as Record<string, any> || {};
      updateData.submitted_fields = {
        ...submittedFields,
        notes,
      };
    }

    return this.prisma.applications.update({
      where: { id },
      data: updateData,
    });
  }
}

