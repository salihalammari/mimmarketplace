import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async sendNeedsInfoReminders() {
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2); // 2 days

    const pendingApplications = await this.prisma.applications.findMany({
      where: {
        status: 'needs_info',
        updated_at: { lt: cutoff },
        OR: [
          { needs_info_reminder_sent_at: null },
          { needs_info_reminder_sent_at: { lt: cutoff } },
        ],
      },
    });

    if (!pendingApplications.length) {
      return;
    }

    this.logger.log(
      `Sending Needs Info reminders for ${pendingApplications.length} applications`,
    );

    for (const application of pendingApplications) {
      await this.notificationsService.notifyNeedsInfoReminder(application);
      await this.prisma.applications.update({
        where: { id: application.id },
        data: { needs_info_reminder_sent_at: new Date() },
      });
    }
  }
}


