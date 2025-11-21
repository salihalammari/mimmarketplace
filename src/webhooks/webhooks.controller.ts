import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebflowWebhookDto } from '../applications/dto/webflow-webhook.dto';
import { WebflowWebhookGuard } from './guards/webflow-webhook.guard';
import { Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('webflow')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(WebflowWebhookGuard) // Temporarily disabled for testing
  async handleWebflowWebhook(@Body() body: any, @Req() req: Request) {
    this.logger.log('=== Webflow Webhook Received ===');
    this.logger.log('Content-Type:', req.headers['content-type']);
    
    // Try multiple ways to get the body
    let parsedBody = body || req.body || {};
    
    // If body is empty, try raw body
    if ((!parsedBody || Object.keys(parsedBody).length === 0) && (req as any).rawBody) {
      try {
        parsedBody = JSON.parse((req as any).rawBody);
        this.logger.log('Parsed from rawBody');
      } catch (e) {
        this.logger.error('Failed to parse rawBody:', e);
      }
    }
    
    this.logger.log('Body type:', typeof parsedBody);
    this.logger.log('Body is array?', Array.isArray(parsedBody));
    this.logger.log('Body keys:', parsedBody ? Object.keys(parsedBody) : 'null');
    this.logger.log('Full body structure:', JSON.stringify(parsedBody, null, 2));
    
    // Debug: Check for nested structures
    if (parsedBody?.data) {
      this.logger.log('Has data property:', Object.keys(parsedBody.data));
      if (parsedBody.data?.payload) {
        this.logger.log('Has payload property:', Object.keys(parsedBody.data.payload));
        if (parsedBody.data.payload?.data) {
          this.logger.log('Has payload.data property:', Object.keys(parsedBody.data.payload.data));
        }
      }
    }
    
    try {
      // Webflow API V2 can send data in multiple formats:
      // 1. Direct: { "field-name": "value", ... }
      // 2. Nested: { "data": { "field-name": "value", ... } }
      // 3. With metadata: { "name": "...", "data": { ... }, "site": "..." }
      // 4. Array format: [{ "name": "field", "value": "data" }]
      
      let formData: Record<string, any> = {};
      
      // Handle array format (Webflow sometimes sends this)
      if (Array.isArray(parsedBody)) {
        this.logger.log('Body is array format, converting...');
        parsedBody.forEach((item: any) => {
          if (item.name && item.value !== undefined) {
            formData[item.name] = item.value;
          } else if (item.field && item.value !== undefined) {
            formData[item.field] = item.value;
          }
        });
      }
      // PRIORITY 1: Handle case where parsedBody IS the data object with triggerType and payload
      // Structure: { triggerType: "...", payload: { data: { full_name: "...", ... } } }
      else if (parsedBody?.triggerType && parsedBody?.payload?.data && typeof parsedBody.payload.data === 'object') {
        this.logger.log('✅ PRIORITY 1: Body is data object, extracting from payload.data');
        formData = parsedBody.payload.data;
      }
      // PRIORITY 2: Handle nested data format with payload (Webflow API V2 format)
      // Structure: { data: { triggerType: "...", payload: { data: { full_name: "...", ... } } } }
      else if (parsedBody?.data?.payload?.data && typeof parsedBody.data.payload.data === 'object') {
        this.logger.log('✅ PRIORITY 2: Using nested payload.data format - extracting from data.payload.data');
        formData = parsedBody.data.payload.data;
      }
      // PRIORITY 3: Handle case where we have data.payload but need to check if payload has data
      else if (parsedBody?.data?.payload && typeof parsedBody.data.payload === 'object') {
        this.logger.log('Checking payload object for nested data...');
        if (parsedBody.data.payload.data && typeof parsedBody.data.payload.data === 'object') {
          this.logger.log('✅ PRIORITY 3: Found data inside payload.data');
          formData = parsedBody.data.payload.data;
        } else {
          this.logger.log('⚠️ Payload does not contain data field, using payload directly');
          formData = parsedBody.data.payload;
        }
      }
      // PRIORITY 4: Handle nested data format (direct data object) - but skip if it has triggerType/payload
      else if (parsedBody?.data && typeof parsedBody.data === 'object') {
        // If data contains triggerType or payload, it's not the form data itself - go deeper
        if (parsedBody.data.triggerType || parsedBody.data.payload) {
          this.logger.log('⚠️ Data contains triggerType/payload, trying to extract from payload.data');
          // Try to extract from payload.data if it exists
          if (parsedBody.data.payload?.data && typeof parsedBody.data.payload.data === 'object') {
            this.logger.log('✅ PRIORITY 4: Extracting from data.payload.data');
            formData = parsedBody.data.payload.data;
          } else {
            this.logger.error('❌ Cannot find form data in nested structure');
            this.logger.error('Available keys in data:', Object.keys(parsedBody.data));
            if (parsedBody.data.payload) {
              this.logger.error('Available keys in payload:', Object.keys(parsedBody.data.payload));
            }
            formData = {};
          }
        } else {
          this.logger.log('Using nested data field (direct)');
          formData = parsedBody.data;
        }
      }
      // PRIORITY 5: Handle direct format (fields at root level)
      else if (parsedBody && typeof parsedBody === 'object') {
        this.logger.log('Using direct body format');
        formData = { ...parsedBody };
      }
      
      this.logger.log('Extracted formData keys:', Object.keys(formData));
      this.logger.log('Extracted formData sample:', JSON.stringify(Object.fromEntries(Object.entries(formData).slice(0, 3)), null, 2));
      
      // Remove metadata fields that Webflow might send
      const metadataFields = [
        'name', 'site', 'submittedAt', 'formId', 'formName', 
        'form', 'id', 'createdOn', 'updatedOn', 'archived',
        'draft', 'test', 'lastPublished', 'lastUpdated',
        'triggerType', 'payload', 'siteId', 'formElementId',
        'pageId', 'publishedPath', 'pageUrl', 'schema'
      ];
      
      const cleanFormData: Record<string, any> = {};
      
      if (formData && typeof formData === 'object') {
        Object.keys(formData).forEach(key => {
          // Skip metadata fields
          if (metadataFields.includes(key.toLowerCase())) {
            return;
          }
          
          const value = formData[key];
          
          // Skip null, undefined, or empty strings
          if (value === null || value === undefined) {
            return;
          }
          
          // Handle empty strings
          if (typeof value === 'string' && value.trim() === '') {
            return;
          }
          
          // Store the value
          cleanFormData[key] = value;
        });
      }
      
      this.logger.log('Clean form data keys:', Object.keys(cleanFormData));
      this.logger.log('Clean form data:', JSON.stringify(cleanFormData, null, 2));
      this.logger.log('Form data extraction check - has full_name?', !!cleanFormData['full_name']);
      this.logger.log('Form data extraction check - has email?', !!cleanFormData['email']);

      // Map specific form fields to normalized keys (attribute-by-attribute)
      const fieldMappings: Record<string, string[]> = {
        full_name: ['full_name', 'full-name', 'fullname', 'seller_name', 'seller-name', 'name'],
        email: ['email', 'e-mail', 'email_address', 'email-address'],
        phone_number: ['phone_number', 'phone-number', 'phone', 'whatsapp', 'mobile', 'tel'],
        selling_page: ['selling_page', 'selling-page', 'main-sales-page', 'shop_url'],
        secondarys_selling_page: [
          'secondarys_selling_page',
          'secondarys-selling-page',
          'secondary-selling-page',
          'secondary_sales_page',
        ],
        city: ['city', 'المدينة'],
        products_category: ['products_category', 'products-category', 'product-category', 'category', 'categories'],
        others: ['others', 'other-products', 'other_products'],
        valide_product: ['valide_product', 'valid_product', 'valide-product', 'valid-product'],
        products_type: ['products_type', 'products-type', 'product_type', 'product-type'],
        time_selling: ['time_selling', 'time-selling', 'selling_duration', 'selling-duration'],
        feedbacks: ['feedbacks', 'customer-feedback', 'customer_feedback'],
        return_policies: ['return_policies', 'return-policies', 'return_handling', 'return-handling'],
        fake_orders: ['fake_orders', 'fake-orders', 'fake_orders_experience', 'fake-orders-experience'],
      };

      const mappedFormData: Record<string, any> = {};
      Object.entries(fieldMappings).forEach(([targetKey, variants]) => {
        for (const variant of variants) {
          if (cleanFormData[variant] !== undefined) {
            mappedFormData[targetKey] = cleanFormData[variant];
            break;
          }
        }
      });

      this.logger.log('Mapped form data (normalized):', JSON.stringify(mappedFormData, null, 2));
      
      // If still empty, log detailed info and return error
      if (!cleanFormData || Object.keys(cleanFormData).length === 0) {
        this.logger.error('Empty form data after processing');
        this.logger.error('Original body keys:', Object.keys(parsedBody));
        this.logger.error('Raw body (first 2000 chars):', (req as any).rawBody?.substring(0, 2000));
        return {
          success: false,
          message: 'Invalid webhook data: no form fields found',
          receivedBody: parsedBody,
          rawBodyPreview: (req as any).rawBody?.substring(0, 1000),
          debug: {
            bodyType: typeof parsedBody,
            isArray: Array.isArray(parsedBody),
            keys: Object.keys(parsedBody),
            hasData: !!parsedBody?.data,
          },
        };
      }
      
      // Create a proper WebflowWebhookDto structure
      const webhookDto: WebflowWebhookDto = {
        name: parsedBody.name || parsedBody.formName || 'Application form',
        site: parsedBody.site || req.headers['x-webflow-site'] || req.headers['webflow-site'] || '',
        data: {
          ...cleanFormData,
          ...mappedFormData,
        },
        submittedAt: parsedBody.submittedAt || parsedBody.createdOn || new Date().toISOString(),
      };
      
      this.logger.log('Processed webhook DTO:', JSON.stringify(webhookDto, null, 2));

      const result = await this.webhooksService.handleWebflowFormSubmission(webhookDto);
      this.logger.log(`Application created successfully with ID: ${result.id}`);
      
      return {
        success: true,
        message: 'Application received successfully',
        applicationId: result.id,
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      this.logger.error('Error stack:', error.stack);
      return {
        success: false,
        message: error.message || 'Error processing webhook',
        error: error.toString(),
      };
    }
  }

  @Post('webflow/test')
  @HttpCode(HttpStatus.OK)
  async testWebhook(@Body() body: any) {
    this.logger.log('Test webhook received');
    return {
      success: true,
      message: 'Webhook endpoint is working',
      receivedData: body,
    };
  }
}

