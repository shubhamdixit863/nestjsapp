import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';

import PaymentService from './payment.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { configData } from 'src/config';
import { CheckoutSessionQuery, CreateCheckoutSession } from 'src/domain/dtos/createCheckoutsession';
import { CreateProductDto } from 'src/domain/dtos/createproduct.dto';
import { StripeWebhook } from 'src/domain/dtos/stripewebhook';
import { UserPaymentStatusDto } from 'src/domain/dtos/userPaymentStatus';
import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import { StripeSubscription, StripeUpdateSubscription } from 'src/domain/dtos/stripe.subscription';
import { BillingPortalRequest } from 'src/domain/dtos/billinportal.dto';



@ApiBearerAuth()
@UseGuards(AzureAuthServiceMiddleware)

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentService) {
    

   }

  @Get("/config")
  async create() {

    return this.paymentService.getKey();

    
  }

  @Get("/checkout-session")
  async getCheckoutSession(@Query() paginationQuery: CheckoutSessionQuery) {

    return this.paymentService.getSession(paginationQuery.sessionId)

    
  }

  @Get("/product/:id")
  @ApiParam({name: 'id', required: true, description: 'id of the product', schema: { oneOf: [{type: 'number'}]}})
  getProductById(@Param('id') id) {
    return this.paymentService.getStripeProductbyId(id);
 
  }



  // Get all the user payments 

  @Post("/status")
  getUserPaymentStatus(@Body() userPayement:UserPaymentStatusDto) {
    return this.paymentService.getUserPayment(userPayement.userUniqueId,userPayement.uniquePaymentId)
 
  }

  /*
  @Post("/creatproduct")
  createProduct(
    
    @Body() product: CreateProductDto,
  ) {
    return this.paymentService.createStripeProduct(product);
  }
  */

  @Get("/getproducts")
  getProducts() {
    return this.paymentService.getAllStripeProducts();
  }

  @Get("/getPrices")
  getPrices() {
    return this.paymentService.getAllPrices();
  }

  @Post("/create-checkout-session")
  createCheckoutSession(
    
    @Body() paymentRequestBody: CreateCheckoutSession,
  ) {
   
    return  this.paymentService.insertUserPayment(paymentRequestBody);
   
  }

  @Post("/create-customer-portal-session")
  createCustomerPortalSession(
    
    @Body() requestBody: BillingPortalRequest,
  ) {
   
    return  this.paymentService.createCustomerPortal(requestBody);
   
  }

  @Post("/cancelSubscription")
  cancelSubscription(
    
    @Body() paymentRequestBody: StripeSubscription,
  ) {
   
    return  this.paymentService.cancelSubscription(paymentRequestBody);
   
  }

  @Post("/updateSubscription")
  updateSubscription(
    
    @Body() paymentRequestBody: StripeUpdateSubscription,
  ) {
   
    return  this.paymentService.updateSubscription(paymentRequestBody);
   
  }

  // Get all userPayments

  @Get("/userpayments/:userUniqueId")
  @ApiParam({name: 'userUniqueId', required: true, description: 'uniqueid of the user', schema: { oneOf: [{type: 'string'}]}})

  allUserPayments(@Param('userUniqueId') userUniqueId) {
   
    return  this.paymentService.getAllUserPayments(userUniqueId);
   
  }


  // Get all the active subscriptions of the usr

  @Get("/subscriptions/:userUniqueId")
  @ApiParam({name: 'userUniqueId', required: true, description: 'uniqueid of the user', schema: { oneOf: [{type: 'string'}]}})

  getAllUserActiveSubscriptions(@Param('userUniqueId') userUniqueId) {
   
    return  this.paymentService.getAllUserActiveSubscriptions(userUniqueId);
   
  }

  // Update the payment status in the db when user cancels the payment
  @Get("/cancelled/:uniquePaymentId")
  @ApiParam({name: 'uniquePaymentId', required: true, description: 'unique Payment Id of the current Payment Attempt', schema: { oneOf: [{type: 'string'}]}})

  userCancelled(@Param('uniquePaymentId') uniquePaymentId) {
   
   return  this.paymentService.updateUserPaymentUserCancelled(uniquePaymentId);
     
  }



}