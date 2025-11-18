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
    // Use @Body() decorator - NestJS will parse it automatically
    const webhookData = body || req.body || {};
    this.logger.log('=== Webflow Webhook Received ===');
    this.logger.log('Content-Type:', req.headers['content-type']);
    this.logger.log('Body type:', typeof req.body);
    this.logger.log('Body is array?', Array.isArray(req.body));
    this.logger.log('Body keys:', req.body ? Object.keys(req.body) : 'null');
    this.logger.log('Full body:', JSON.stringify(req.body, null, 2));
    
    // Try to parse raw body if body is empty
    let parsedBody = req.body;
    if ((!parsedBody || Object.keys(parsedBody).length === 0) && (req as any).rawBody) {
      try {
        parsedBody = JSON.parse((req as any).rawBody);
        this.logger.log('Parsed from rawBody:', JSON.stringify(parsedBody, null, 2));
      } catch (e) {
        this.logger.error('Failed to parse rawBody:', e);
      }
    }
    
    try {
      // Webflow API V2 sends data directly in the body, not nested
      // The body contains form field names as keys
      let formData = parsedBody;
      
      // Check if data is nested (some webhook formats)
      if (parsedBody?.data && typeof parsedBody.data === 'object') {
        formData = parsedBody.data;
        this.logger.log('Using nested data field');
      }
      
      // Remove metadata fields that Webflow might send
      const metadataFields = ['name', 'site', 'submittedAt', 'formId', 'formName'];
      const cleanFormData: Record<string, any> = {};
      
      if (formData && typeof formData === 'object') {
        Object.keys(formData).forEach(key => {
          if (!metadataFields.includes(key)) {
            cleanFormData[key] = formData[key];
          }
        });
      }
      
      this.logger.log('Clean form data keys:', Object.keys(cleanFormData));
      this.logger.log('Clean form data:', JSON.stringify(cleanFormData, null, 2));
      
      // If still empty, return error
      if (!cleanFormData || Object.keys(cleanFormData).length === 0) {
        this.logger.error('Empty form data after processing');
        this.logger.error('Raw body (first 1000 chars):', (req as any).rawBody?.substring(0, 1000));
        return {
          success: false,
          message: 'Invalid webhook data: no form fields found',
          receivedBody: parsedBody,
          rawBodyPreview: (req as any).rawBody?.substring(0, 500),
        };
      }
      
      // Create a proper WebflowWebhookDto structure
      const webhookDto: WebflowWebhookDto = {
        name: parsedBody.name || 'Application form',
        site: parsedBody.site || req.headers['x-webflow-site'] || '',
        data: cleanFormData,
        submittedAt: parsedBody.submittedAt || new Date().toISOString(),
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

