import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const healthStatus: {
      status: string;
      timestamp: string;
      database: 'connected' | 'disconnected' | 'unknown';
      error?: string;
    } = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'unknown',
    };

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      healthStatus.database = 'connected';
    } catch (error: any) {
      healthStatus.database = 'disconnected';
      healthStatus.error = error?.message || 'Unknown error';
    }

    return healthStatus;
  }

  @Get()
  getAdminDashboard(@Res() res: Response) {
    // Try dist folder first (production), then root (development)
    const distPath = join(__dirname, '..', 'admin-dashboard', 'index.html');
    const rootPath = join(process.cwd(), 'admin-dashboard', 'index.html');
    const path = fs.existsSync(distPath) ? distPath : rootPath;
    res.sendFile(path);
  }

  @Get('admin')
  getAdmin(@Res() res: Response) {
    // Try dist folder first (production), then root (development)
    const distPath = join(__dirname, '..', 'admin-dashboard', 'index.html');
    const rootPath = join(process.cwd(), 'admin-dashboard', 'index.html');
    const path = fs.existsSync(distPath) ? distPath : rootPath;
    res.sendFile(path);
  }
}

