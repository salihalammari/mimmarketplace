import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all origins (optional)
  app.enableCors({ origin: true, methods: 'GET,POST,PATCH,DELETE,OPTIONS' });

  // NestJS handles JSON parsing automatically, but we need to preserve raw body for webhooks
  // Use body-parser with verify to capture raw body
  app.use(bodyParser.json({
    limit: '10mb',
    verify: (req: any, res, buf) => {
      // Preserve raw body for webhook signature verification
      if (req.url && req.url.includes('/webhooks/webflow')) {
        req.rawBody = buf.toString('utf8');
      }
    }
  }));

  // Serve static files from admin-dashboard directory
  const fs = require('fs');
  const distPath = join(__dirname, '..', 'admin-dashboard');
  const rootPath = join(process.cwd(), 'admin-dashboard');
  const adminPath = fs.existsSync(distPath) ? distPath : rootPath;
  
  if (fs.existsSync(adminPath)) {
    app.useStaticAssets(adminPath, {
      prefix: '/admin',
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Use Render's dynamic port
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  // Determine base URL dynamically
  const baseUrl = process.env.RENDER_EXTERNAL_URL 
    ? process.env.RENDER_EXTERNAL_URL 
    : `http://localhost:${port}`;
  
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Admin Dashboard: ${baseUrl}/admin`);
}

bootstrap();

