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

  // Configure body parser to preserve raw body for webhook signature verification
  // Use json parser with verify to preserve raw body
  app.use('/webhooks/webflow', bodyParser.json({ 
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString('utf8');
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
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Admin Dashboard: http://localhost:${port}/admin/`);
}

bootstrap();

