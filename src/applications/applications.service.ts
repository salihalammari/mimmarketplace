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

    // Extract required fields - using exact Webflow form field names
    const sellerName = getString(
      'full_name', 'full-name', 'full name', 'fullname',
      'الاسم-الكامل', 'الاسم الكامل', 'name', 'seller-name', 'seller_name'
    );
    const email = getString(
      'email', 'البريد-الالكتروني', 'البريد الالكتروني', 
      'e-mail', 'email-address', 'email_address'
    );
    const phone = getString(
      'phone_number', 'phone-number', 'phone', 'whatsapp', 
      'رقم-الهاتف', 'رقم الهاتف', 'tel', 'telephone', 'mobile'
    );

    // Products category - can be array or string
    const categoryFromForm = getArray(
      'products_category', 'products-category', 'products_category',
      'category', 'categories', 'فئات-البيع', 'فئات البيع',
      'category-select', 'category_select', 'product-category'
    );
    const category = categoryFromForm[0] || getString('products_category', 'category', 'فئة') || 'general';
    const language =
      getString('language', 'form-language', 'form_language', 'اللغة', 'lang') ||
      (webhookData.site?.includes('.ma') ? 'ar' : 'en');
    
    // Validate required fields
    if (!sellerName || !sellerName.trim()) {
      throw new Error('Missing required field: seller name (full_name)');
    }
    if (!email || !email.trim()) {
      throw new Error('Missing required field: email');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    const sellingPage = getString('selling_page', 'selling-page', 'main-sales-page', 'shop_url');
    const secondarySellingPage = getString('secondarys_selling_page', 'secondarys-selling-page', 'secondary-selling-page', 'secondary_selling_page');
    const cityValue = getString('city', 'المدينة');
    const otherProducts = getString('others', 'other-products', 'other_products');
    const validProduct = getBoolean('valide_product', 'valide-product', 'valid-product', 'valid_product');
    const productsType = getString('products_type', 'products-type', 'product-type', 'product_type');
    const timeSelling = getString('time_selling', 'time-selling', 'selling-duration', 'selling_duration');
    const customerFeedback = getString('feedbacks', 'customer-feedback', 'customer_feedback');
    const returnPolicies = getString('return_policies', 'return-policies', 'return-handling', 'return_handling');
    const fakeOrders = getString('fake_orders', 'fake-orders', 'fake-orders-experience', 'fake_orders_experience');
    const badgeUsageLocations = getArray(
      'badge_use',
      'badge-use',
      'badge_usage',
      'badge-usage',
      'badge_usage_locations',
      'preferred-badge-use',
      'preferred_badge_use',
    );
    const deliveryDuration = getString('delivery_duration', 'delivery-duration', 'shipping-time', 'shipping_time');
    const deliveryZone = getString('delivery_zone', 'delivery-zone', 'delivery-area', 'delivery_area');
    const whatsappNumber = getString('whatsapp', 'phone_number', 'phone-number');
    const instagramHandle = getString('instagram', 'instagram-link');
    const facebookHandle = getString('facebook', 'facebook-link');
    const tiktokHandle = getString('tiktok');

    // Map all fields from Webflow form to database structure
    const submittedFields: Record<string, any> = {
      // Main fields
      sellingPage,
      secondarySellingPage,
      city: cityValue,
      productsCategory: categoryFromForm.length > 0 ? categoryFromForm : getString('products_category', 'products-category'),
      otherProducts,
      validProduct,
      productsType,
      timeSelling,
      feedbacks: customerFeedback,
      returnPolicies,
      fakeOrders,
      badgeUsageLocations,
      preferredBadgeUse: badgeUsageLocations.length ? badgeUsageLocations.join(', ') : undefined,
      deliveryDuration,
      deliveryZone,
      
      // Additional fields (for backward compatibility)
      mainSalesPageLink: sellingPage,
      secondarySalesPageLink: secondarySellingPage,
      salesCategories: categoryFromForm,
      productsAndBrand: getString('products_category', 'products-category'),
      sellingDuration: timeSelling,
      customerFeedback,
      returnHandling: returnPolicies,
      fakeOrdersExperience: fakeOrders,
      productType: productsType,
      
      // Optional fields that might exist
      whatsappNumber,
      instagramHandle,
      facebookHandle,
      tiktokHandle,
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

    // Only include phone if it has a value
    const applicationData: CreateApplicationDto = {
      seller_name: sellerName.trim(),
      email: email.trim().toLowerCase(),
      ...(phone && phone.trim() ? { phone: phone.trim() } : {}),
      category: category.trim(),
      language,
      selling_page: sellingPage,
      secondary_selling_page: secondarySellingPage,
      city: cityValue,
      other_products: otherProducts,
      valid_product: validProduct,
      products_type: productsType,
      time_selling: timeSelling,
      feedbacks: customerFeedback,
      return_policies: returnPolicies,
      fake_orders: fakeOrders,
      badge_use: badgeUsageLocations.length ? badgeUsageLocations : undefined,
      delivery_duration: deliveryDuration,
      delivery_zone: deliveryZone,
      whatsapp_number: whatsappNumber,
      instagram_handle: instagramHandle,
      facebook_handle: facebookHandle,
      tiktok_handle: tiktokHandle,
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

