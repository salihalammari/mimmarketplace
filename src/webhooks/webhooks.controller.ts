import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebflowWebhookDto } from '../applications/dto/webflow-webhook.dto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('webflow')
  @HttpCode(HttpStatus.OK)
  async handleWebflowWebhook(@Body() webhookData: WebflowWebhookDto) {
    this.logger.log('Received Webflow webhook');
    this.logger.debug('Webhook data:', JSON.stringify(webhookData, null, 2));
    
    try {
      const result = await this.webhooksService.handleWebflowFormSubmission(webhookData);
      return {
        success: true,
        message: 'Application received successfully',
        applicationId: result.id,
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
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

