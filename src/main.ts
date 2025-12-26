import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

async function bootstrap() {
  try {
    // Log environment info for debugging
    const port = process.env.PORT || 3000;
    console.log(`🔧 Starting server on port ${port}`);
    console.log(`🔧 PORT env var: ${process.env.PORT || 'not set (using default 3000)'}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

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

    // Use Render's dynamic port - ensure we bind to 0.0.0.0 to accept external connections
    await app.listen(port, '0.0.0.0');
    
    // Determine base URL dynamically
    const baseUrl = process.env.RENDER_EXTERNAL_URL 
      ? process.env.RENDER_EXTERNAL_URL 
      : `http://localhost:${port}`;
    
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 Listening on 0.0.0.0:${port}`);
    console.log(`📊 Admin Dashboard: ${baseUrl}/admin`);
    console.log(`✅ Server is ready to accept connections`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Fatal error in bootstrap:', error);
  process.exit(1);
});

