import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(private prisma: PrismaService) {}

  async createBadge(applicationId: string, level: number = 1) {
    // First, create or get seller
    const application = await this.prisma.applications.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    // Check if seller already exists (by name)
    let seller = await this.prisma.sellers.findFirst({
      where: {
        name: application.full_name,
      },
    });

    // Create seller if doesn't exist
    if (!seller) {
      seller = await this.prisma.sellers.create({
        data: {
          name: application.full_name,
          category: application.category,
          city: (application.submitted_fields as any)?.city || null,
          shop_url: (application.submitted_fields as any)?.mainSalesPageLink || null,
          level: this.getLevelString(level),
        },
      });
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
    await this.prisma.applications.update({
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

    // Create audit log
    await this.prisma.audit_logs.create({
      data: {
        entity_type: 'badge',
        entity_id: badge.id,
        action: 'badge_created',
        meta: { applicationId, level, badgeCode },
      },
    });

    this.logger.log(`Badge created: ${badge.code} for seller ${seller.name}`);

    return {
      ...badge,
      seller,
      application,
      badgeUrl: this.generateBadgeUrl(badge.code),
    };
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
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 3);

    return this.prisma.badges.update({
      where: { id: badgeId },
      data: {
        status: 'active',
        valid_until: validUntil,
      },
    });
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

