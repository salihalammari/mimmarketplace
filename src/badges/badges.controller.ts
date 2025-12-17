import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, Res, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { BadgesService } from './badges.service';

@Controller('badges')
export class BadgesController {
  private readonly logger = new Logger(BadgesController.name);

  constructor(private readonly badgesService: BadgesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createBadge(@Body() body: { applicationId: string; level?: number }) {
    try {
      if (!body.applicationId) {
        throw new HttpException('Application ID is required', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Creating badge for application ${body.applicationId} with level ${body.level || 1}`);
      
      const result = await this.badgesService.createBadge(body.applicationId, body.level || 1);
      
      this.logger.log(`Badge created successfully: ${(result as any).code || 'unknown'}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to create badge: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Failed to create badge: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

