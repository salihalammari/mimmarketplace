import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';
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
  private readonly gmailTransporter?: nodemailer.Transporter;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly emailProvider: 'gmail' | 'resend' | 'none';

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('NOTIFICATION_FROM_EMAIL') || 'noreply@mimmarketplace.com';
    this.fromName = this.configService.get<string>('NOTIFICATION_FROM_NAME') || 'MIM Marketplace';

    // Prioritize Resend (more reliable) over Gmail
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.emailProvider = 'resend';
      this.logger.log('Email notifications enabled via Resend');
    } else {
      // Fallback to Gmail if Resend not configured
      const gmailUser = this.configService.get<string>('GMAIL_USER');
      const gmailAppPassword = this.configService.get<string>('GMAIL_APP_PASSWORD');

      if (gmailUser && gmailAppPassword) {
        this.gmailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });
        this.emailProvider = 'gmail';
        this.logger.log(`Email notifications enabled via Gmail (${gmailUser})`);
      } else {
        this.emailProvider = 'none';
        this.logger.warn('No email provider configured. Set RESEND_API_KEY (recommended) or GMAIL_USER/GMAIL_APP_PASSWORD.');
      }
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
    this.logger.log(
      `notifyStatusChange called for application ${application.id} with status: ${status}`,
    );
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
    this.logger.log(
      `[NOTIFICATION] Starting notifications for application ${application.id} (template: ${template}, email: ${application.email})`,
    );

    const { email, subject, htmlBody, textBody } = this.buildEmailTemplate(
      application,
      template,
      notes,
      isReminder,
    );

    // Send email - ALWAYS attempt if email exists
    let emailSent = false;
    if (email) {
      if (this.emailProvider === 'gmail' && this.gmailTransporter) {
        try {
          this.logger.log(`[EMAIL] Attempting to send email to ${email} via Gmail...`);
          const result = await this.gmailTransporter.sendMail({
            from: `${this.fromName} <${this.fromEmail}>`,
            to: email,
            subject,
            html: htmlBody,
            text: textBody,
          });
          this.logger.log(
            `[EMAIL] ✅ Email notification sent successfully to ${email} for application ${application.id}. Message ID: ${result.messageId || 'N/A'}`,
          );
          emailSent = true;
        } catch (error) {
          this.logger.error(
            `[EMAIL] ❌ Failed to send email notification via Gmail for application ${application.id}: ${error.message}`,
            error.stack,
          );
        }
      } else if (this.emailProvider === 'resend' && this.resend) {
        try {
          this.logger.log(`[EMAIL] Attempting to send email to ${email} via Resend...`);
          const result = await this.resend.emails.send({
            from: `${this.fromName} <${this.fromEmail}>`,
            to: email,
            subject,
            html: htmlBody,
            text: textBody,
          });
          this.logger.log(
            `[EMAIL] ✅ Email notification sent successfully to ${email} for application ${application.id}. Resend ID: ${(result as any).id || 'N/A'}`,
          );
          emailSent = true;
        } catch (error) {
          this.logger.error(
            `[EMAIL] ❌ Failed to send email notification via Resend for application ${application.id}: ${error.message}`,
            error.stack,
          );
        }
      } else {
        this.logger.warn(
          `[EMAIL] ⚠️ No email provider configured. Email notification skipped for application ${application.id}. Set GMAIL_USER/GMAIL_APP_PASSWORD or RESEND_API_KEY.`,
        );
      }
    } else {
      this.logger.warn(
        `[EMAIL] ⚠️ No email address found for application ${application.id}. Email notification skipped.`,
      );
    }

    // WhatsApp notification - ALWAYS attempt if message template exists
    const whatsappMessage = this.buildWhatsAppTemplate(application, template, notes, isReminder);
    let whatsappSent = false;
    if (whatsappMessage) {
      this.logger.log(`[WHATSAPP] Attempting to send WhatsApp message for application ${application.id}...`);
      const phone = this.getWhatsAppNumber(application);
      if (phone) {
        await this.sendWhatsAppMessage(application, whatsappMessage);
        // Note: sendWhatsAppMessage logs success/failure internally
        whatsappSent = true; // We attempted, even if it failed
      } else {
        this.logger.warn(
          `[WHATSAPP] ⚠️ No phone number found for application ${application.id}. WhatsApp notification skipped.`,
        );
      }
    } else {
      this.logger.debug(`[WHATSAPP] No WhatsApp message template for template: ${template}`);
    }

    // Summary log
    this.logger.log(
      `[NOTIFICATION] Summary for application ${application.id}: Email=${emailSent ? '✅' : '❌'}, WhatsApp=${whatsappSent ? '✅' : '❌'}`,
    );
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
            `[WHATSAPP] ✅ WhatsApp notification sent via Evolution API to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `[WHATSAPP] ⚠️ Evolution API failed for ${phone}: ${error}`,
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
            `[WHATSAPP] ✅ WhatsApp notification sent via Business API to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `[WHATSAPP] ⚠️ WhatsApp Business API failed for ${phone}: ${error}`,
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
        const baseUrl = chatApiUrl.replace(/\/$/, ''); // Remove trailing slash
        const url = `${baseUrl}/sendMessage?token=${chatApiToken}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phone.replace('+', ''), // ChatAPI expects number without '+'
            body: message,
            instanceId: chatApiInstance,
          }),
        });

        if (response.ok) {
          this.logger.log(
            `[WHATSAPP] ✅ WhatsApp notification sent via ChatAPI to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `[WHATSAPP] ⚠️ ChatAPI failed for ${phone}: ${error}`,
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
            `[WHATSAPP] ✅ WhatsApp notification sent via webhook to ${phone} for application ${application.id}`,
          );
          return;
        } else {
          const error = await response.text();
          this.logger.warn(
            `[WHATSAPP] ⚠️ WhatsApp webhook failed for ${phone}: ${error}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to send WhatsApp via webhook for application ${application.id}: ${error.message}`,
        );
      }
    }

    // If no WhatsApp service configured, log warning
    if (!evolutionApiUrl && !whatsappBusinessApiUrl && !chatApiUrl && !whatsappWebhookUrl) {
      this.logger.warn(
        `[WHATSAPP] ⚠️ No WhatsApp service configured. Message prepared for ${phone} but not sent:\n${message}`,
      );
    } else {
      // All services failed
      this.logger.error(
        `[WHATSAPP] ❌ All WhatsApp services failed for application ${application.id}. Phone: ${phone}. Message: "${message.substring(0, 50)}..."`,
      );
    }
  }

  // Diagnostic method to check configuration
  getConfigurationStatus() {
    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailAppPassword = this.configService.get<string>('GMAIL_APP_PASSWORD');
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    const fromEmail = this.configService.get<string>('NOTIFICATION_FROM_EMAIL') || this.fromEmail;
    const fromName = this.configService.get<string>('NOTIFICATION_FROM_NAME') || this.fromName;
    
    const evolutionApiUrl = this.configService.get<string>('EVOLUTION_API_URL');
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');
    const evolutionInstance = this.configService.get<string>('EVOLUTION_INSTANCE_NAME');
    
    const whatsappBusinessApiUrl = this.configService.get<string>('WHATSAPP_BUSINESS_API_URL');
    const whatsappBusinessToken = this.configService.get<string>('WHATSAPP_BUSINESS_TOKEN');
    const whatsappBusinessPhoneId = this.configService.get<string>('WHATSAPP_BUSINESS_PHONE_ID');
    
    const chatApiUrl = this.configService.get<string>('CHATAPI_URL');
    const chatApiInstance = this.configService.get<string>('CHATAPI_INSTANCE_ID');
    const chatApiToken = this.configService.get<string>('CHATAPI_TOKEN');
    
    const whatsappWebhookUrl = this.configService.get<string>('WHATSAPP_WEBHOOK_URL');
    
    return {
      email: {
        provider: this.emailProvider,
        enabled: this.emailProvider !== 'none',
        fromEmail,
        fromName,
        gmail: {
          enabled: !!(gmailUser && gmailAppPassword),
          user: gmailUser || 'Not set',
          appPasswordSet: !!gmailAppPassword,
        },
        resend: {
          enabled: !!resendApiKey,
          apiKeySet: !!resendApiKey,
        },
      },
      whatsapp: {
        evolutionApi: {
          enabled: !!(evolutionApiUrl && evolutionInstance),
          url: evolutionApiUrl ? 'Set' : 'Not set',
          instance: evolutionInstance || 'Not set',
          apiKey: evolutionApiKey ? 'Set' : 'Not set',
        },
        businessApi: {
          enabled: !!(whatsappBusinessApiUrl && whatsappBusinessToken && whatsappBusinessPhoneId),
          url: whatsappBusinessApiUrl ? 'Set' : 'Not set',
          token: whatsappBusinessToken ? 'Set' : 'Not set',
          phoneId: whatsappBusinessPhoneId || 'Not set',
        },
        chatApi: {
          enabled: !!(chatApiUrl && chatApiInstance && chatApiToken),
          url: chatApiUrl ? 'Set' : 'Not set',
          instance: chatApiInstance || 'Not set',
          token: chatApiToken ? 'Set' : 'Not set',
        },
        webhook: {
          enabled: !!whatsappWebhookUrl,
          url: whatsappWebhookUrl ? 'Set' : 'Not set',
        },
        anyEnabled: !!(evolutionApiUrl || whatsappBusinessApiUrl || chatApiUrl || whatsappWebhookUrl),
      },
    };
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
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Remove all spaces
    cleaned = cleaned.replace(/\s+/g, '');
    
    // If already starts with +, ensure it's properly formatted
    if (cleaned.startsWith('+')) {
      // Remove any extra + signs
      cleaned = '+' + cleaned.replace(/^\+/g, '').replace(/[^\d]/g, '');
      return cleaned;
    }

    // Remove leading zeros
    const digits = cleaned.replace(/^0+/, '');
    
    // Add default country code if missing
    const defaultCountryCode = this.configService.get<string>('WHATSAPP_DEFAULT_COUNTRY_CODE') || '+212';
    return `${defaultCountryCode}${digits}`;
  }
}

