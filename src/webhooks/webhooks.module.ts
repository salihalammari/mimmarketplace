import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { ApplicationsModule } from '../applications/applications.module';
import { WebflowWebhookGuard } from './guards/webflow-webhook.guard';

@Module({
  imports: [ApplicationsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebflowWebhookGuard],
})
export class WebhooksModule {}

