import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
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
  private readonly resend?: Resend;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('NOTIFICATION_FROM_EMAIL') || 'noreply@mimmarketplace.com';
    this.fromName = this.configService.get<string>('NOTIFICATION_FROM_NAME') || 'MIM Marketplace';

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Email notifications enabled via Resend');
    } else {
      this.logger.warn('RESEND_API_KEY missing. Email notifications are disabled.');
    }
  }

  async notifyApplicationReceived(application: applications) {
    await this.sendNotifications(application, 'received');
  }

  async notifyStatusChange(
    application: applications,
    status: StatusTemplateKey,
    notes?: string,
  ) {
    await this.sendNotifications(application, status, notes);
  }

  async notifyNeedsInfoReminder(application: applications) {
    await this.sendNotifications(application, 'needs_info', undefined, true);
  }

  private async sendNotifications(
    application: applications,
    template: StatusTemplateKey,
    notes?: string,
    isReminder = false,
  ) {
    const { email, subject, htmlBody, textBody } = this.buildEmailTemplate(
      application,
      template,
      notes,
      isReminder,
    );

    // Send email
    if (this.resend && email) {
      try {
        await this.resend.emails.send({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: email,
          subject,
          html: htmlBody,
          text: textBody,
        });
        this.logger.log(`Email notification sent to ${email} for application ${application.id}`);
      } catch (error) {
        this.logger.error(
          `Failed to send email notification for application ${application.id}: ${error.message}`,
        );
      }
    }

    // WhatsApp notification
    const whatsappMessage = this.buildWhatsAppTemplate(application, template, notes, isReminder);
    if (whatsappMessage) {
      await this.sendWhatsAppMessage(application, whatsappMessage);
    }
  }

  private buildEmailTemplate(
    application: applications,
    template: StatusTemplateKey,
    notes?: string,
    isReminder = false,
  ) {
    const name = application.full_name || 'صديقي';
    const email = application.email;

    let subject: string;
    let htmlBody: string;
    let textBody: string;

    if (isReminder) {
      subject = 'تذكير: معلومات إضافية مطلوبة - MIM Marketplace';
      htmlBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>مرحباً ${name}</h2>
          <p>تذكير بسيط — ما زلنا ننتظر المعلومات الإضافية لإكمال عملية التحقق.</p>
          <p>من فضلك قم بتقديم المعلومات المطلوبة في أقرب وقت ممكن.</p>
          <p>شكراً لك،<br>فريق MIM Marketplace</p>
        </div>
      `;
      textBody = `مرحباً ${name}، تذكير بسيط — ما زلنا ننتظر المعلومات الإضافية لإكمال عملية التحقق.`;
    } else {
      switch (template) {
        case 'received':
          subject = 'شكراً لتقديم طلبك - MIM Marketplace';
          htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>سلام ${name}👋</h2>
              <p>شكرا لملء استمارة طلب الشارة الرقمية للثقة.</p>
              <p>لقد توصلنا بطلبك وسوف نقوم بمراجعته والتواصل معك في أقرب وقت.</p>
              <p>شكراً لك،<br>فريق MIM Marketplace</p>
            </div>
          `;
          textBody = `سلام ${name}👋\n\nشكرا لملء استمارة طلب الشارة الرقمية للثقة.\nلقد توصلنا بطلبك وسوف نقوم بمراجعته والتواصل معك في أقرب وقت.`;
          break;

        case 'needs_info': {
          const extra = notes
            ? `\n\nالمعلومات المطلوبة:\n${notes}`
            : '\n\nمن فضلك أرسل لنا التفاصيل المطلوبة لنكمل الطلب.';
          subject = 'معلومات إضافية مطلوبة - MIM Marketplace';
          htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>سلام ${name}</h2>
              <p>‼️نحن بحاجة لبعض المعلومات منك قبل إكمال الطلب.${notes ? `<br><br><strong>المعلومات المطلوبة:</strong><br>${notes}` : '<br><br>من فضلك أرسل لنا التفاصيل المطلوبة لنكمل الطلب.'}</p>
              <p>شكراً لك،<br>فريق MIM Marketplace</p>
            </div>
          `;
          textBody = `سلام ${name}\n‼️نحن بحاجة لبعض المعلومات منك قبل إكمال الطلب.${extra}`;
          break;
        }

        case 'qualified':
          subject = 'مبروك! تم قبول طلبك - MIM Marketplace';
          htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>خبار كتفرح🤩</h2>
              <p>${name}، لقد تم قبول طلبك من أجل Mim Verified.</p>
              <p>ستتوصل بشارتك الرقمية قريبا🥳</p>
              <p>شكراً لك،<br>فريق MIM Marketplace</p>
            </div>
          `;
          textBody = `خبار كتفرح🤩\n${name}، لقد تم قبول طلبك من أجل Mim Verified.\nستتوصل بشارتك الرقمية قريبا🥳`;
          break;

        case 'rejected':
          subject = 'تحديث على طلبك - MIM Marketplace';
          htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>سلام ${name}</h2>
              <p>شكرا لتقديمك، لكن يؤسفنا أن نخبرك أن متجرك لا يستوفي جميع متطلبات التحقق حاليا.</p>
              <p>يمكنك إعادة التقديم لاحقا بعد التحسن.</p>
              <p>شكراً لك،<br>فريق MIM Marketplace</p>
            </div>
          `;
          textBody = `سلام ${name}\nشكرا لتقديمك، لكن يؤسفنا أن نخبرك أن متجرك لا يستوفي جميع متطلبات التحقق حاليا.\nيمكنك إعادة التقديم لاحقا بعد التحسن.`;
          break;

        case 'badge_activated':
          subject = 'مبروك! شارتك الرقمية أصبحت فعالة - MIM Marketplace';
          htmlBody = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>مبروك ✅</h2>
              <p>${name}، شارتك الرقمية أصبحت فعالة.</p>
              <p>يمكنك الحصول عليها من بريدك الإلكتروني واستعمالها في صفحات البيع الخاصة بك.</p>
              <p>شكراً لك،<br>فريق MIM Marketplace</p>
            </div>
          `;
          textBody = `مبروك ✅\n${name}، شارتك الرقمية أصبحت فعالة.\nيمكنك الحصول عليها من بريدك الإلكتروني واستعمالها في صفحات البيع الخاصة بك.`;
          break;
      }
    }

    return { email, subject, htmlBody, textBody };
  }

  private buildWhatsAppTemplate(
    application: applications,
    template: StatusTemplateKey,
    notes?: string,
    isReminder = false,
  ): string | null {
    const name = application.full_name || 'صديقي';

    if (isReminder) {
      return `مرحباً ${name}، تذكير بسيط — ما زلنا ننتظر المعلومات الإضافية لإكمال عملية التحقق.`;
    }

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

  private async sendWhatsAppMessage(application: applications, message: string) {
    const phone = this.getWhatsAppNumber(application);
    if (!phone) {
      this.logger.debug(
        `Skipping WhatsApp notification for application ${application.id}: no phone number`,
      );
      return;
    }

    const evolutionApiUrl = this.configService.get<string>('EVOLUTION_API_URL');
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');
    const evolutionInstance = this.configService.get<string>('EVOLUTION_INSTANCE_NAME');

    // Option 1: Evolution API (Free, self-hosted)
    if (evolutionApiUrl && evolutionInstance) {
      try {
        // Remove trailing slash from URL
        const baseUrl = evolutionApiUrl.replace(/\/$/, '');
        const url = `${baseUrl}/message/sendText/${evolutionInstance}`;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (evolutionApiKey) {
          headers['apikey'] = evolutionApiKey;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            number: phone,
            text: message,
          }),
        });

        if (response.ok) {
          this.logger.log(
            `WhatsApp notification sent via Evolution API to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `Evolution API failed for ${phone}: ${error}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to send WhatsApp via Evolution API for application ${application.id}: ${error.message}`,
        );
      }
    }

    // Option 2: WhatsApp Business API (if configured)
    const whatsappBusinessApiUrl = this.configService.get<string>('WHATSAPP_BUSINESS_API_URL');
    const whatsappBusinessToken = this.configService.get<string>('WHATSAPP_BUSINESS_TOKEN');
    const whatsappBusinessPhoneId = this.configService.get<string>('WHATSAPP_BUSINESS_PHONE_ID');

    if (whatsappBusinessApiUrl && whatsappBusinessToken && whatsappBusinessPhoneId) {
      try {
        const response = await fetch(
          `${whatsappBusinessApiUrl}/${whatsappBusinessPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${whatsappBusinessToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phone,
              type: 'text',
              text: { body: message },
            }),
          },
        );

        if (response.ok) {
          this.logger.log(
            `WhatsApp notification sent via Business API to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `WhatsApp Business API failed for ${phone}: ${error}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to send WhatsApp via Business API for application ${application.id}: ${error.message}`,
        );
      }
    }

    // Option 3: ChatAPI (Direct API - Simple!)
    const chatApiUrl = this.configService.get<string>('CHATAPI_URL');
    const chatApiInstance = this.configService.get<string>('CHATAPI_INSTANCE_ID');
    const chatApiToken = this.configService.get<string>('CHATAPI_TOKEN');

    if (chatApiUrl && chatApiInstance && chatApiToken) {
      try {
        const baseUrl = chatApiUrl.replace(/\/$/, '');
        const response = await fetch(
          `${baseUrl}/instance${chatApiInstance}/sendMessage?token=${chatApiToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone,
              body: message,
            }),
          },
        );

        if (response.ok) {
          this.logger.log(
            `WhatsApp notification sent via ChatAPI to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `ChatAPI failed for ${phone}: ${error}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to send WhatsApp via ChatAPI for application ${application.id}: ${error.message}`,
        );
      }
    }

    // Option 4: Webhook-based services (Make.com, Zapier, etc.) - EASIEST!
    const whatsappWebhookUrl = this.configService.get<string>('WHATSAPP_WEBHOOK_URL');
    if (whatsappWebhookUrl) {
      try {
        const response = await fetch(whatsappWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            message,
            applicationId: application.id,
            applicationName: application.full_name,
          }),
        });

        if (response.ok) {
          this.logger.log(
            `WhatsApp notification sent via webhook to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `WhatsApp webhook failed for ${phone}: ${error}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to send WhatsApp via webhook for application ${application.id}: ${error.message}`,
        );
      }
    }

    // If no WhatsApp service configured, log the message for manual sending
    if (!evolutionApiUrl && !whatsappBusinessApiUrl && !chatApiUrl && !whatsappWebhookUrl) {
      this.logger.debug(
        `WhatsApp message prepared for ${phone} (no service configured):\n${message}`,
      );
    }
  }

  private getWhatsAppNumber(application: applications): string | null {
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
    const defaultCountryCode = this.configService.get<string>('WHATSAPP_DEFAULT_COUNTRY_CODE') || '+212';
    return `${defaultCountryCode}${cleaned}`;
  }
}

