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
    console.log('=== Creating Application from Webflow ===');
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2));
    const formData = webhookData.data || {};
    console.log('Form data keys:', Object.keys(formData));
    console.log('Form data:', JSON.stringify(formData, null, 2));

    const normalizeKey = (key: string) =>
      key
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-');

    const normalizedData = Object.entries(formData).reduce<Record<string, any>>(
      (acc, [key, value]) => {
        acc[normalizeKey(key)] = value;
        return acc;
      },
      {},
    );

    const getValue = (...keys: string[]) => {
      for (const key of keys) {
        const normalizedKey = normalizeKey(key);
        if (normalizedData[normalizedKey] !== undefined) {
          return normalizedData[normalizedKey];
        }
      }
      return undefined;
    };

    const getString = (...keys: string[]): string | undefined => {
      const value = getValue(...keys);
      if (value === undefined || value === null) return undefined;
      if (typeof value === 'string') return value.trim();
      if (Array.isArray(value)) return value.join(', ');
      return String(value);
    };

    const getArray = (...keys: string[]): string[] => {
      const value = getValue(...keys);
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        if (!value.trim()) return [];
        if (value.includes(',')) {
          return value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
        }
        return [value.trim()];
      }
      return [];
    };

    const getBoolean = (...keys: string[]): boolean | undefined => {
      const value = getValue(...keys);
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['yes', 'oui', 'true', '1', 'نعم', 'صح'].includes(normalized)) return true;
        if (['no', 'non', 'false', '0', 'لا'].includes(normalized)) return false;
      }
      return undefined;
    };

    const sellerName =
      getString('full-name', 'full_name', 'full name', 'الاسم-الكامل') || '';
    const email = getString('email', 'البريد-الالكتروني') || '';
    const phone = getString('phone', 'phone-number', 'whatsapp', 'رقم-الهاتف');

    const categoryFromForm = getArray(
      'products-category',
      'category',
      'فئات-البيع',
      'category-select',
    );
    const category = categoryFromForm[0] || 'general';
    const language =
      getString('language', 'form-language', 'اللغة') ||
      (webhookData.site?.includes('.ma') ? 'ar' : 'en');

    const submittedFields: Record<string, any> = {
      mainSalesPageLink: getString('main-sales-page', 'selling-page', 'رابط-صفحة-البيع'),
      secondarySalesPageLink: getString('secondary-selling-page', 'secondary page'),
      city: getString('city', 'المدينة'),
      productsAndBrand: getString('products-brand', 'products', 'products-and-brand', 'products category'),
      salesCategories: categoryFromForm,
      otherProducts: getString('others', 'other-products'),
      imagesBelongToStore: getBoolean('images-belong-to-store', 'do-you-sell-the-same-product-pictu'),
      productType: getString('product-type', 'products-type'),
      sellingDuration: getString('selling-duration', 'how-long-youve-been-selling'),
      customerFeedback: getString('customer-feedback', 'do-you-receive-feedbacks'),
      returnHandling: getString('return-handling', 'return-policies'),
      fakeOrdersExperience: getString('fake-orders', 'do-you-face-fake-orders'),
      shippingTime: getString('shipping-time', 'delivery-duration'),
      deliveryArea: getString('delivery-area', 'delivery-zone'),
      badgeUsageLocations: getArray('badge-usage', 'badge-use'),
      preferredBadgeUse: getString('badge-use'),
      whatsappNumber: getString('whatsapp'),
      instagramHandle: getString('instagram', 'instagram-link'),
      facebookHandle: getString('facebook', 'facebook-link'),
      tiktokHandle: getString('tiktok'),
      additionalNotes: getString('notes', 'message'),
    };

    Object.keys(submittedFields).forEach((key) => {
      const value = submittedFields[key];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && !value.trim()) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete submittedFields[key];
      }
    });

    const applicationData: CreateApplicationDto = {
      seller_name: sellerName,
      email,
      phone,
      category,
      language,
      submitted_fields:
        Object.keys(submittedFields).length > 0 ? submittedFields : undefined,
    };

    console.log('=== Application Data to Save ===');
    console.log('Core fields:', { seller_name: sellerName, email, phone, category, language });
    console.log('Submitted fields count:', Object.keys(submittedFields).length);
    console.log('Submitted fields:', JSON.stringify(submittedFields, null, 2));

    const result = await this.create(applicationData);
    console.log('=== Application Saved Successfully ===');
    console.log('Application ID:', result.id);
    console.log('Total fields saved:', Object.keys(submittedFields).length);
    
    return result;
  }

  async findAll(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.applications.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.applications.findMany({
      where: { status },
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
        adminNotes: notes,
        statusUpdatedAt: new Date().toISOString(),
      };
    }

    // Create audit log
    await this.prisma.audit_logs.create({
      data: {
        entity_type: 'application',
        entity_id: id,
        action: `status_updated_to_${status}`,
        meta: { status, notes },
      },
    });

    return this.prisma.applications.update({
      where: { id },
      data: updateData,
    });
  }

  async getStats() {
    const [total, pending, qualified, rejected, needsInfo, badgeActivated] = await Promise.all([
      this.prisma.applications.count(),
      this.prisma.applications.count({ where: { status: 'pending' } }),
      this.prisma.applications.count({ where: { status: 'qualified' } }),
      this.prisma.applications.count({ where: { status: 'rejected' } }),
      this.prisma.applications.count({ where: { status: 'needs_info' } }),
      this.prisma.applications.count({ where: { status: 'badge_activated' } }),
    ]);

    return {
      total,
      pending,
      qualified,
      rejected,
      needsInfo,
      badgeActivated,
    };
  }
}

