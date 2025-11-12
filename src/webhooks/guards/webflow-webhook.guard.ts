import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebflowWebhookGuard implements CanActivate {
  private readonly logger = new Logger(WebflowWebhookGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['webflow-signature'] || request.headers['x-webflow-signature'];
    const webhookSecret = this.configService.get<string>('WEBFLOW_WEBHOOK_SECRET');

    // Skip verification if secret is not set (for development/testing)
    if (!webhookSecret) {
      this.logger.warn('WEBFLOW_WEBHOOK_SECRET not set, skipping signature verification');
      return true;
    }

    if (!signature) {
      this.logger.error('Missing webhook signature');
      throw new UnauthorizedException('Missing webflow signature header');
    }

    // Get raw body for signature verification (preserved by body parser)
    const rawBody = (request as any).rawBody || JSON.stringify(request.body);
    const expectedSignature = this.generateSignature(rawBody, webhookSecret);

    // Webflow uses HMAC SHA256 - compare signatures
    // Use timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      this.logger.error('Invalid webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.log('Webhook signature verified successfully');
    return true;
  }

  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
}

