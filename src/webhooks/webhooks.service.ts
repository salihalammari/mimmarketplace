import { Injectable, Logger } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { WebflowWebhookDto } from '../applications/dto/webflow-webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly applicationsService: ApplicationsService) {}

  async handleWebflowFormSubmission(webhookData: WebflowWebhookDto) {
    this.logger.log(`Processing form submission: ${webhookData.name}`);
    
    // Create application from webflow data
    const application = await this.applicationsService.createFromWebflow(webhookData);
    
    this.logger.log(`Application created with ID: ${application.id}`);
    
    // TODO: Send WhatsApp notification here
    // await this.sendWhatsAppNotification(application);
    
    return application;
  }
}

