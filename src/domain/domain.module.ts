import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';

@Module({
    providers:[PrismaService,SentryService],
  
})
export class DomainModule {}
