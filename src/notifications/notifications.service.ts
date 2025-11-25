import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio, { Twilio } from 'twilio';
import { applications } from '@prisma/client';

type StatusTemplateKey =
  | 'received'
  | 'needs_info'
  | 'qualified'
  | 'rejected'
  | 'badge_activated';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly client?: Twilio;
  private readonly whatsappFrom?: string;
  private readonly defaultCountryCode: string | undefined;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.whatsappFrom = this.configService.get<string>('TWILIO_WHATSAPP_FROM');
    this.defaultCountryCode = this.configService.get<string>(
      'WHATSAPP_DEFAULT_COUNTRY_CODE',
    );

    if (accountSid && authToken && this.whatsappFrom) {
      this.client = twilio(accountSid, authToken);
      this.logger.log('WhatsApp notifications enabled');
    } else {
      this.logger.warn(
        'Twilio WhatsApp credentials missing. Notifications are disabled.',
      );
    }
  }

  async notifyApplicationReceived(application: applications) {
    await this.dispatchTemplate(application, 'received');
  }

  async notifyStatusChange(
    application: applications,
    status: StatusTemplateKey,
    notes?: string,
  ) {
    await this.dispatchTemplate(application, status, notes);
  }

  async notifyNeedsInfoReminder(application: applications) {
    await this.sendMessage(application, this.buildReminderMessage(application));
  }

  private async dispatchTemplate(
    application: applications,
    template: StatusTemplateKey,
    notes?: string,
  ) {
    const message = this.buildTemplateMessage(application, template, notes);
    if (!message) return;
    await this.sendMessage(application, message);
  }

  private async sendMessage(application: applications, body: string) {
    if (!this.client || !this.whatsappFrom) {
      this.logger.debug(
        `Skipping WhatsApp notification for ${application.email}; provider disabled.`,
      );
      return;
    }

    const recipient = this.getRecipient(application);
    if (!recipient) {
      this.logger.warn(
        `Cannot send WhatsApp notification for application ${application.id}: missing phone number.`,
      );
      return;
    }

    try {
      await this.client.messages.create({
        from: `whatsapp:${this.whatsappFrom}`,
        to: `whatsapp:${recipient}`,
        body,
      });
      this.logger.log(
        `WhatsApp notification sent to ${recipient} for application ${application.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send WhatsApp notification for application ${application.id}: ${error.message}`,
      );
    }
  }

  private getRecipient(application: applications): string | null {
    const raw =
      application.whatsapp_number ||
      application.phone ||
      (application.submitted_fields as any)?.whatsappNumber ||
      null;

    if (!raw) return null;
    return this.normalizePhone(raw);
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) {
      return digits;
    }

    const cleaned = digits.replace(/^0+/, '');
    if (this.defaultCountryCode) {
      return `${this.defaultCountryCode}${cleaned}`;
    }

    // Fallback to assuming Moroccan numbers if no default provided
    return `+212${cleaned}`;
  }

  private buildTemplateMessage(
    application: applications,
    template: StatusTemplateKey,
    notes?: string,
  ): string | null {
    const name = application.full_name || 'صديقي';
    switch (template) {
      case 'received':
        return `سلام ${name}👋\n\n‏شكرا لملء استمارة طلب الشارة الرقمية للثقة.\n‏لقد توصلنا بطلبك وسوف نقوم بمراجعته والتواصل معك في أقرب وقت.`;
      case 'needs_info': {
        const extra = notes
          ? `\n\nالمعلومات المطلوبة:\n${notes}`
          : '\n\nمن فضلك أرسل لنا التفاصيل المطلوبة لنكمل الطلب.';
        return `سلام ${name}\n‼️نحن بحاجة لبعض المعلومات منك قبل إكمال الطلب.${extra}`;
      }
      case 'qualified':
        return `خبار كتفرح🤩\n${name}، لقد تم قبول طلبك من أجل Mim Verified.\nستتوصل بشارتك الرقمية قريبا🥳`;
      case 'rejected':
        return `سلام ${name}\nشكرا لتقديمك، لكن يؤسفنا أن نخبرك أن متجرك لا يستوفي جميع متطلبات التحقق حاليا.\nيمكنك إعادة التقديم لاحقا بعد التحسن.`;
      case 'badge_activated':
        return `مبروك ✅\n${name}، شارتك الرقمية أصبحت فعالة.\nيمكنك الحصول عليها من بريدك الإلكتروني واستعمالها في صفحات البيع الخاصة بك.`;
      default:
        return null;
    }
  }

  private buildReminderMessage(application: applications): string {
    const name = application.full_name || 'صديقي';
    return `مرحباً ${name}، تذكير بسيط — ما زلنا ننتظر المعلومات الإضافية لإكمال عملية التحقق.`;
  }
}


