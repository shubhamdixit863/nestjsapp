import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import UserRepositoryPostGres from 'src/domain/adapters/user.repository.impl';
import { AuthMiddleware } from 'src/domain/middlewares/auth.middleware';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { StripeService } from 'src/infrastructure/stripe/stripe.service';

import { PaymentsController } from './api/payments/payment.controller';
import PaymentService from './api/payments/payment.service';
import UserController from './api/user/user.controller';
import UserService from './api/user/user.service';
import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import AzureController from './api/azure/azure.controller';
import ProductRepositoryPostGres from 'src/domain/adapters/product.repository.impl';
import { FileUploadService } from 'src/infrastructure/azure/file.upload.service';
import UserPaymentRepositoryPostGres from 'src/domain/adapters/userpayment.repository';
import UtilsController from './api/utils/utils.controller';
import SubscriptionRepositoryPostgres from 'src/domain/adapters/subscription.repository.impl';
import { StripeController } from './api/stripe/stripe.controller';
import { SubscriptionController } from './api/subscription/subscription.controller';
import SubscriptionService from './api/subscription/subscription.service';
import { EmailService } from 'src/infrastructure/externalApis/email.service.external';
import EmailSendingService from './api/emails/emailsending.service';
import EmailController from './api/emails/email.controller';
import { AzureGraphService } from 'src/infrastructure/azure/azure.graph.service';
import AzureService from './api/azure/azure.service';
import { AzureAuthProvideForGraphService } from 'src/infrastructure/azure/azuregraph.auth';
import AdminController from './api/admin/admin.controller';
import { RoleRepositoryImpl } from 'src/domain/adapters/role.repository.impl';
import { AdminService } from './api/admin/admin.service';
import { PriceRepositoryImpl } from 'src/domain/adapters/price.repository.impl';
import { ApiService } from 'src/infrastructure/externalApis/api.service';
import { ApiKeyMiddleware } from 'src/domain/middlewares/apikey.middleware';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';
import { AzureServiceBus } from 'src/infrastructure/azure/azure.service_bus';


@Module({
    providers: [
     
     PrismaService,
     PaymentService,
     UserService,
     EmailService,
     EmailSendingService,

     StripeService,
     AzureAuthServiceMiddleware,
     FileUploadService,
     SubscriptionService,
     AdminService,
     AzureGraphService,
     AzureService,
     AzureAuthProvideForGraphService,
     ApiService,   // Service For Calling External Apis
     ApiKeyMiddleware,
     SentryService,
     AzureServiceBus,
     {
      provide:'RoleRepository',
      useClass:RoleRepositoryImpl

     },
     {
      provide:'SubscriptionRepository',
      useClass:SubscriptionRepositoryPostgres

     },
     {
      provide:'PriceRepository',
      useClass:PriceRepositoryImpl

     },
    
    

         {
          provide: 'UserPaymentRepository',
          useClass: UserPaymentRepositoryPostGres,
        },

        {
          provide: 'SubscriptionRepository',
          useClass: SubscriptionRepositoryPostgres,
        },
      
        {
          provide: 'UserRepository',
          useClass: UserRepositoryPostGres,
        },
        {
          provide: 'ProductRepository',
          useClass: ProductRepositoryPostGres,
        },
      ],
      controllers: [AdminController,EmailController,SubscriptionController,StripeController,UserController,PaymentsController,AzureController,UtilsController],

})
export class ApplicationModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'organisation', method: RequestMethod.GET}, {path: 'organisation', method: RequestMethod.POST});
  }
}
