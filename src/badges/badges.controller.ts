import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
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

  @Get('seller/:sellerId')
  async getBadgesBySeller(@Param('sellerId') sellerId: string) {
    return this.badgesService.getBadgesBySeller(sellerId);
  }

  @Post('renew/:badgeId')
  async renewBadge(@Param('badgeId') badgeId: string) {
    return this.badgesService.renewBadge(badgeId);
  }
}

