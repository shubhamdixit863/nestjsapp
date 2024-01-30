import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CheckoutSessionQuery, CreateCheckoutSession } from 'src/domain/dtos/createCheckoutsession';
import { CreateProductDto } from 'src/domain/dtos/createproduct.dto';
import { StripeWebhook } from 'src/domain/dtos/stripewebhook';
import { UserPaymentStatusDto } from 'src/domain/dtos/userPaymentStatus';
import PaymentService from '../payments/payment.service';
import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import SubscriptionService from './subscription.service';


@ApiBearerAuth()
@UseGuards(AzureAuthServiceMiddleware)
@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
constructor(private subscriptionService: SubscriptionService) {}

 
@Get("/:userUniqueId")
@ApiParam({name: 'userUniqueId', required: true, description: 'userUniqueId of the User Used In Azure', schema: { oneOf: [{type: 'number'}]}})
getSubscriptionsByUserUniqueId(@Param('userUniqueId') userUniqueId) {
  return this.subscriptionService.getUserSubscription(userUniqueId)

}


}