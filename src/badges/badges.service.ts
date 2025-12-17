import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createBadge(applicationId: string, level: number = 1) {
    try {
      this.logger.log(`Starting badge creation for application ${applicationId} with level ${level}`);
      
      // First, create or get seller
      const application = await this.prisma.applications.findUnique({
        where: { id: applicationId },
      });

      if (!application) {
        this.logger.error(`Application not found: ${applicationId}`);
        throw new Error('Application not found');
      }

      this.logger.log(`Application found: ${application.full_name} (${application.email})`);

    // Check if seller already exists (by name)
    let seller = await this.prisma.sellers.findFirst({
      where: {
        name: application.full_name,
      },
    });

    // Create seller if doesn't exist
    if (!seller) {
      this.logger.log(`Creating new seller: ${application.full_name}`);
      try {
        seller = await this.prisma.sellers.create({
          data: {
            name: application.full_name,
            category: application.category || 'general',
            city: (application.submitted_fields as any)?.city || null,
            shop_url: (application.submitted_fields as any)?.mainSalesPageLink || null,
            level: this.getLevelString(level),
          },
        });
        this.logger.log(`Seller created: ${seller.id}`);
      } catch (error) {
        this.logger.error(`Failed to create seller: ${error.message}`, error.stack);
        throw new Error(`Failed to create seller: ${error.message}`);
      }
    } else {
      this.logger.log(`Using existing seller: ${seller.id} (${seller.name})`);
    }

    // Generate unique badge code
    const badgeCode = this.generateBadgeCode(applicationId, level);

    // Calculate validity (3 months from now)
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 3);

    // Create badge
    const badge = await this.prisma.badges.create({
      data: {
        seller_id: seller.id,
        code: badgeCode,
        status: 'active',
        valid_until: validUntil,
      },
    });

    // Update application status
    const updatedApplication = await this.prisma.applications.update({
      where: { id: applicationId },
      data: {
        status: 'badge_activated',
        submitted_fields: {
          ...(application.submitted_fields as any || {}),
          badgeId: badge.id,
          badgeCode: badge.code,
          badgeLevel: level,
          badgeActivatedAt: new Date().toISOString(),
        },
      },
    });

    // Create audit log (use applicationId as entity_id due to foreign key constraint)
    await this.prisma.audit_logs.create({
      data: {
        entity_type: 'badge',
        entity_id: applicationId, // Use applicationId, not badge.id (FK constraint)
        action: 'badge_created',
        meta: { applicationId, badgeId: badge.id, level, badgeCode },
      },
    });

    this.logger.log(`Badge created: ${badge.code} for seller ${seller.name}`);

    const badgeUrl = this.generateBadgeUrl(badge.code);

    // Trigger notification with badge link
    // Use updated application which includes badge information
    try {
      await this.notificationsService.notifyStatusChange(
        updatedApplication,
        'badge_activated',
        undefined,
      );
      this.logger.log(`Notification sent for badge ${badge.code} to ${updatedApplication.email}`);
    } catch (error) {
      this.logger.error(`Failed to send notification for badge ${badge.code}: ${error.message}`);
      // Don't fail badge creation if notification fails
    }

    const result = {
      ...badge,
      seller,
      application: updatedApplication,
      badgeUrl,
    };

    this.logger.log(`Badge creation completed successfully: ${badge.code}`);
    
    return result;
    } catch (error) {
      this.logger.error(`Error in createBadge: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getBadgeByCode(code: string) {
    return this.prisma.badges.findUnique({
      where: { code },
      include: {
        sellers: true,
      },
    });
  }

  async getBadgesBySeller(sellerId: string) {
    return this.prisma.badges.findMany({
      where: { seller_id: sellerId },
      orderBy: {
        issued_at: 'desc',
      },
      include: {
        sellers: true,
      },
    });
  }

  async renewBadge(badgeId: string) {
    const badge = await this.prisma.badges.findUnique({
      where: { id: badgeId },
      include: { sellers: true },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    // Find application by seller name for audit log
    const application = await this.prisma.applications.findFirst({
      where: { full_name: badge.sellers.name },
      orderBy: { created_at: 'desc' },
    });

    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 3);

    const updatedBadge = await this.prisma.badges.update({
      where: { id: badgeId },
      data: {
        status: 'active',
        valid_until: validUntil,
      },
    });

    // Create audit log (use applicationId if found, otherwise skip FK constraint)
    if (application) {
      await this.prisma.audit_logs.create({
        data: {
          entity_type: 'badge',
          entity_id: application.id,
          action: 'badge_renewed',
          meta: { badgeId, validUntil: validUntil.toISOString() },
        },
      });
    }

    this.logger.log(`Badge renewed: ${badge.code} for seller ${badge.sellers.name}`);

    return updatedBadge;
  }

  async suspendBadge(badgeId: string, reason?: string) {
    const badge = await this.prisma.badges.findUnique({
      where: { id: badgeId },
      include: { sellers: true },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    const updatedBadge = await this.prisma.badges.update({
      where: { id: badgeId },
      data: {
        status: 'suspended',
      },
    });

    // Find application by seller name for audit log
    const application = await this.prisma.applications.findFirst({
      where: { full_name: badge.sellers.name },
      orderBy: { created_at: 'desc' },
    });

    // Create audit log (use applicationId if found)
    if (application) {
      await this.prisma.audit_logs.create({
        data: {
          entity_type: 'badge',
          entity_id: application.id,
          action: 'badge_suspended',
          meta: { badgeId, reason: reason || 'No reason provided' },
        },
      });
    }

    this.logger.warn(`Badge suspended: ${badge.code} for seller ${badge.sellers.name}. Reason: ${reason || 'No reason provided'}`);

    return updatedBadge;
  }

  async revokeBadge(badgeId: string, reason: string) {
    const badge = await this.prisma.badges.findUnique({
      where: { id: badgeId },
      include: { sellers: true },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    const updatedBadge = await this.prisma.badges.update({
      where: { id: badgeId },
      data: {
        status: 'revoked',
      },
    });

    // Find application by seller name for audit log
    const application = await this.prisma.applications.findFirst({
      where: { full_name: badge.sellers.name },
      orderBy: { created_at: 'desc' },
    });

    // Create audit log (use applicationId if found)
    if (application) {
      await this.prisma.audit_logs.create({
        data: {
          entity_type: 'badge',
          entity_id: application.id,
          action: 'badge_revoked',
          meta: { badgeId, reason },
        },
      });
    }

    this.logger.warn(`Badge revoked: ${badge.code} for seller ${badge.sellers.name}. Reason: ${reason}`);

    return updatedBadge;
  }

  async checkInactiveSellers() {
    // Check for sellers inactive for 60+ days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const inactiveBadges = await this.prisma.badges.findMany({
      where: {
        status: 'active',
        issued_at: {
          lte: sixtyDaysAgo,
        },
      },
      include: {
        sellers: true,
      },
    });

    // Check if seller has any recent activity (verifications)
    const badgesToSuspend = [];
    for (const badge of inactiveBadges) {
      const recentVerifications = await this.prisma.verifications.findMany({
        where: {
          badge_id: badge.id,
          checked_at: {
            gte: sixtyDaysAgo,
          },
        },
      });

      // If no recent verifications, seller is inactive
      if (recentVerifications.length === 0) {
        badgesToSuspend.push(badge);
      }
    }

    return badgesToSuspend;
  }

  async autoSuspendInactiveSellers() {
    const inactiveBadges = await this.checkInactiveSellers();
    const suspended = [];

    for (const badge of inactiveBadges) {
      try {
        await this.suspendBadge(badge.id, 'Seller inactive for more than 60 days');
        suspended.push(badge);
      } catch (error) {
        this.logger.error(`Failed to suspend badge ${badge.id}: ${error.message}`);
      }
    }

    this.logger.log(`Auto-suspended ${suspended.length} inactive badges`);
    return suspended;
  }

  async upgradeBadgeLevel(badgeId: string, newLevel: number) {
    const badge = await this.prisma.badges.findUnique({
      where: { id: badgeId },
      include: { sellers: true },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    if (newLevel < 1 || newLevel > 3) {
      throw new Error('Invalid badge level. Must be between 1 and 3');
    }

    // Update seller level
    await this.prisma.sellers.update({
      where: { id: badge.seller_id },
      data: {
        level: this.getLevelString(newLevel),
      },
    });

    // Generate new badge code with new level prefix
    const newBadgeCode = this.generateBadgeCode(badge.id, newLevel);

    // Update badge with new code
    const updatedBadge = await this.prisma.badges.update({
      where: { id: badgeId },
      data: {
        code: newBadgeCode,
      },
    });

    // Find application by seller name for audit log
    const application = await this.prisma.applications.findFirst({
      where: { full_name: badge.sellers.name },
      orderBy: { created_at: 'desc' },
    });

    // Create audit log (use applicationId if found)
    if (application) {
      await this.prisma.audit_logs.create({
        data: {
          entity_type: 'badge',
          entity_id: application.id,
          action: 'badge_upgraded',
          meta: { badgeId, oldLevel: badge.sellers.level, newLevel: this.getLevelString(newLevel) },
        },
      });
    }

    this.logger.log(`Badge upgraded: ${badge.code} -> ${newBadgeCode} for seller ${badge.sellers.name} to level ${newLevel}`);

    return {
      ...updatedBadge,
      badgeUrl: this.generateBadgeUrl(newBadgeCode),
    };
  }

  private generateBadgeCode(applicationId: string, level: number): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const levelPrefix = level === 1 ? 'V' : level === 2 ? 'T' : 'G';
    return `${levelPrefix}${timestamp}${random}`.toUpperCase();
  }

  private getLevelString(level: number): string {
    switch (level) {
      case 1:
        return 'verified';
      case 2:
        return 'trusted';
      case 3:
        return 'golden';
      default:
        return 'basic';
    }
  }

  private generateBadgeUrl(code: string): string {
    return `https://mimmarketplace.onrender.com/badges/${code}`;
  }
}

