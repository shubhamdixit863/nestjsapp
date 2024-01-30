import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChargeRequest } from 'src/domain/dtos/chargerequest.dto';
import { Response } from 'src/domain/dtos/response.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { configData } from 'src/config';
import {
  CheckoutSessionQuery,
  CreateCheckoutSession,
} from 'src/domain/dtos/createCheckoutsession';
import { CreateProductDto } from 'src/domain/dtos/createproduct.dto';
import { StripeWebhook } from 'src/domain/dtos/stripewebhook';
import { UserPaymentStatusDto } from 'src/domain/dtos/userPaymentStatus';
import PaymentService from '../payments/payment.service';
import { EmailService } from 'src/infrastructure/externalApis/email.service.external';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private paymentService: PaymentService,
  
  ) {}

  @Post('/webhook')
  async webhookStripe(@Body() event: StripeWebhook) {
    // Handle the event

    //customer.subscription.updated
    if (event.type == 'invoice.payment_succeeded') {
      console.log('INVOICE payment succedded---------');
      let subscription = event.data.object.subscription;
      //console.log("subscription data----",JSON.stringify(event.data));

     await  this.paymentService.updateUserPayment(
        subscription,
        event.data.object.amount_due,
        event.data.object.customer,
        event.data.object.hosted_invoice_url,
        event.data.object.customer_email
      );

      //Purchase Product Email to the customer need to be sent here -----
      return;
    } else if (event.type == 'invoice.payment_failed') {
      let subscription = event.data.object.subscription;
      // This neeed to be handled in case the payment is happening second time
      this.paymentService.updateUserPayment(
        subscription,
        event.data.object.amount_due,
        event.data.object.customer,
        event.data.object.hosted_invoice_url,
        event.data.object.customer_email
      );

      // Update the subscription as well if it exists --this needs to be handled

      return;
    } else if (event.type == 'customer.subscription.updated') {
      let subscription = event.data.object.id;
      //sent whenever a subscription is changed. For example, adding a coupon, applying a discount, adding an invoice item, and changing plans all trigger this event.
     // Pass new price id and the unque Id to update the subscription
      this.paymentService.subscriptionUpdate(
        subscription,
        event.data.object.amount_due,
        event.data.object.customer,
        event.data.object.hosted_invoice_url,

        //event.data.object.metadata.userUniqueId,
        //event.data.object.plan.id,
      );
      return;
    } else if (event.type == 'invoice.upcoming') {
      //Sent a few days prior to the renewal of the
      //subscription. The number of days is based on the number set for
      //Upcoming renewal events in the Dashboard.
    }

    return;
  }
}
