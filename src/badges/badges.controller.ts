import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { BadgesService } from './badges.service';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createBadge(@Body() body: { applicationId: string; level?: number }) {
    return this.badgesService.createBadge(body.applicationId, body.level || 1);
  }

  @Get('code/:code')
  async getBadgeByCode(@Param('code') code: string) {
    return this.badgesService.getBadgeByCode(code);
  }

  @Get(':code')
  async getBadgeVerificationPage(@Param('code') code: string, @Res() res: Response) {
    // Serve HTML verification page
    const distPath = join(__dirname, '..', '..', 'admin-dashboard', 'badge-verification.html');
    const rootPath = join(process.cwd(), 'admin-dashboard', 'badge-verification.html');
    const path = fs.existsSync(distPath) ? distPath : rootPath;
    
    if (fs.existsSync(path)) {
      return res.sendFile(path);
    }
    
    // Fallback: return JSON if HTML not found
    const badge = await this.badgesService.getBadgeByCode(code);
    return res.json(badge);
  }

  @Get('seller/:sellerId')
  async getBadgesBySeller(@Param('sellerId') sellerId: string) {
    return this.badgesService.getBadgesBySeller(sellerId);
  }

  @Post('renew/:badgeId')
  async renewBadge(@Param('badgeId') badgeId: string) {
    return this.badgesService.renewBadge(badgeId);
  }

  @Post('suspend/:badgeId')
  @HttpCode(HttpStatus.OK)
  async suspendBadge(
    @Param('badgeId') badgeId: string,
    @Body() body?: { reason?: string },
  ) {
    return this.badgesService.suspendBadge(badgeId, body?.reason);
  }

  @Post('revoke/:badgeId')
  @HttpCode(HttpStatus.OK)
  async revokeBadge(
    @Param('badgeId') badgeId: string,
    @Body() body: { reason: string },
  ) {
    return this.badgesService.revokeBadge(badgeId, body.reason);
  }

  @Post('upgrade/:badgeId')
  @HttpCode(HttpStatus.OK)
  async upgradeBadgeLevel(
    @Param('badgeId') badgeId: string,
    @Body() body: { level: number },
  ) {
    return this.badgesService.upgradeBadgeLevel(badgeId, body.level);
  }

  @Get('check-inactive')
  async checkInactiveSellers() {
    return this.badgesService.checkInactiveSellers();
  }

  @Post('auto-suspend-inactive')
  @HttpCode(HttpStatus.OK)
  async autoSuspendInactiveSellers() {
    return this.badgesService.autoSuspendInactiveSellers();
  }
}

