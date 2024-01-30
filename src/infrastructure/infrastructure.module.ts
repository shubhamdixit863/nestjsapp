import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StripeService } from './stripe/stripe.service';
import { AzureAuthServiceMiddleware } from './azure/azure.auth.servicemiddleware';
import { FileUploadService } from './azure/file.upload.service';
import { AzureAuthProvideForGraphService } from './azure/azuregraph.auth';
import { AzureGraphService } from './azure/azure.graph.service';
import { AsyncEventService } from './externalApis/async.eventservice';
import EmailSendingService from 'src/application/api/emails/emailsending.service';
import { EmailService } from './externalApis/email.service.external';
import { SentryService } from './sentry/sentry.service';

@Module({
    providers: [SentryService,EmailService,AzureAuthProvideForGraphService,AzureGraphService,PrismaService,StripeService,AzureAuthServiceMiddleware,FileUploadService],
  exports: [SentryService,EmailService,AzureAuthProvideForGraphService,AzureGraphService,PrismaService,StripeService,AzureAuthServiceMiddleware,FileUploadService],
})
export class InfrastructureModule {

    
}
