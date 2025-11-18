import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database');
      this.logger.error(`Error: ${error.message}`);
      
      if (error.message?.includes("Can't reach database server")) {
        this.logger.warn('\n⚠️  Database connection failed, but continuing in development mode...');
        this.logger.warn('💡 Troubleshooting:');
        this.logger.warn('1. Check your DATABASE_URL in .env has the COMPLETE password (not truncated)');
        this.logger.warn('2. Verify network connectivity to Supabase');
        this.logger.warn('3. Ensure your Supabase database is running');
        this.logger.warn('4. For local dev, try the pooler endpoint: aws-1-us-east-2.pooler.supabase.com:5432');
        this.logger.warn('5. Or test on Render deployment where connection should work');
        
        // In development, allow app to start without DB connection
        // In production, we should fail fast
        if (process.env.NODE_ENV === 'production') {
          this.logger.error('❌ Production mode: Cannot start without database connection');
          throw error;
        } else {
          this.logger.warn('⚠️  Development mode: Starting without database connection');
          this.logger.warn('⚠️  Database-dependent features will not work until connection is established');
        }
      } else {
        // For other errors (auth, etc), always throw
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}

