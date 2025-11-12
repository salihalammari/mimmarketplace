import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
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

