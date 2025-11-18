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
  async handleWebflowWebhook(@Body() webhookData: WebflowWebhookDto, @Req() req: Request) {
    this.logger.log('Received Webflow webhook');
    this.logger.log('Webhook data type:', typeof webhookData);
    this.logger.log('Webhook data keys:', webhookData ? Object.keys(webhookData) : 'null');
    this.logger.debug('Webhook data:', JSON.stringify(webhookData, null, 2));
    
    try {
      if (!webhookData || !webhookData.data) {
        this.logger.error('Invalid webhook data structure:', webhookData);
        return {
          success: false,
          message: 'Invalid webhook data: missing data field',
          receivedData: webhookData,
        };
      }

      const result = await this.webhooksService.handleWebflowFormSubmission(webhookData);
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

