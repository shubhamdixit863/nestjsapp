import { Inject, Injectable } from '@nestjs/common';
import { configData } from 'src/config';
import { CreateCheckoutSession } from 'src/domain/dtos/createCheckoutsession';
import { Response } from 'src/domain/dtos/response.dto';
import { UserPaymentEntity } from 'src/domain/entity/UserPaymentEntity';
import { ProductRepository } from 'src/domain/ports/product.repository';
import { UserPaymentRepository } from 'src/domain/ports/userPayment.repository';
import { StripeService } from 'src/infrastructure/stripe/stripe.service';
import { v4 as uuidv4 } from 'uuid';
import SubscriptionService from '../subscription/subscription.service';
import {
  StripeSubscription,
  StripeUpdateSubscription,
} from 'src/domain/dtos/stripe.subscription';
import { UserRepository } from 'src/domain/ports/user.repository';
import { BillingPortalRequest } from 'src/domain/dtos/billinportal.dto';
import { RoleRepository } from 'src/domain/ports/role.repository';
import { SubscriptionRepository } from 'src/domain/ports/subscription.repository';
import { PriceRepository } from 'src/domain/ports/price.repository';
import { ApiService } from 'src/infrastructure/externalApis/api.service';
import { EmailService } from 'src/infrastructure/externalApis/email.service.external';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';

@Injectable()
export default class PaymentService {
  moduleName = 'Payment Service';
  constructor(
    private stripeService: StripeService,
    private subService: SubscriptionService,
    @Inject('ProductRepository') private productRepo: ProductRepository,
    @Inject('UserPaymentRepository') private userPayment: UserPaymentRepository,
    @Inject('UserRepository') private userRepository: UserRepository,
    @Inject('RoleRepository') private roleRepository: RoleRepository,
    @Inject('SubscriptionRepository') private subRepo: SubscriptionRepository,
    @Inject('PriceRepository') private readonly priceRepo: PriceRepository,
    private readonly apiService: ApiService, // external api service here
    private sentryService: SentryService,
    private emailServiceExternal: EmailService,
  ) {}

  async createCharge(paymentRequestBody: any): Promise<Response> {
    try {
      let result = await this.stripeService.createPayment(paymentRequestBody);
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In createCharge - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  async createCustomerPortal(
    paymentRequestBody: BillingPortalRequest,
  ): Promise<Response> {
    try {
      // Get the user by userUbnique Id
      let user = await this.userRepository.getUserByUniqueId(
        paymentRequestBody.userUniqueId,
      );
      let result = await this.stripeService.CreateBillingPortalLink(
        user.stripeCustomerId,
        paymentRequestBody.redirectUrl,
      );
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In createCustomerPortal - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  async cancelSubscription(
    subscription: StripeSubscription,
  ): Promise<Response> {
    try {
      let result = await this.stripeService.cancelSubscription(
        subscription.subscriptionId,
      );

      // Updating it in our database as well

      await this.subRepo.deleteSubscriptionByUserUniqueId(
        subscription.userUniqueId,
        subscription.subscriptionId,
      );
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In cancelSubscription - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  async updateSubscription(
    subscription: StripeUpdateSubscription,
  ): Promise<Response> {
    try {
      let result = await this.stripeService.updateSubscription(
        subscription.subscriptionId,
        subscription.priceId,
      );

      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In updatesubscription - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  // Get  all products for stripe

  async getAllStripeProducts(): Promise<Response> {
    try {
      let result = await this.productRepo.getAllProducts();
      this.sentryService.logInfo(
        `Error In getAllStripeProducts Called ,Module Name ${this.moduleName}`,
      );

      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In Getting Stripe Products - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  async getStripeProductbyId(id: number): Promise<Response> {
    try {
      let result = await this.productRepo.getProductById(Number(id));
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error IngetStripeProductbyId - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('success', null, error);
    }
  }

  async getSession(sessionId: string): Promise<Response> {
    try {
      let session = await this.stripeService.getCheckoutSession(sessionId);
      return new Response('success', session, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In Getting Stripe Session - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('failure', null, 'Error in Retrieving Price');
    }
  }
  async getKey(): Promise<Response> {
    try {
      return new Response(
        'success',
        {
          publicKey: configData.STRIPE_PUBLISHABLE_KEY,
        },
        null,
      );
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In getting stripe Public Key - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('failure', null, 'Error in Retrieving Price');
    }
  }

  // Create checkout session

  async createCheckoutSession(
    paymentRequestBody: CreateCheckoutSession,
    unqiuePaymentId: string,
    userUniqueId: string,
    productDbData: string,
    stripeCustomerId: string,
  ): Promise<any> {
    try {
      // Get whole of product details created by the stripe to be passed as metaData in the payment
      let result = await this.stripeService.createCheckoutSession(
        paymentRequestBody.priceId,
        paymentRequestBody.quantity,
        paymentRequestBody.url,
        unqiuePaymentId,
        userUniqueId,
        productDbData,
        stripeCustomerId,
      );

      return result;
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In creating checkout Session - ${error.toString},Module Name ${this.moduleName}`,
      );

      return error;
    }
  }

  // insert into the database payment

  async insertUserPayment(
    paymentRequestBody: CreateCheckoutSession,
  ): Promise<Response> {
    try {
      const uniquePaymentId = uuidv4();

      // Creating checkout session

      // Calling product repo and the userInformation (such that we can get email and the name for prefilling at stripe checkout page)

      const [productDbData, user] = await Promise.all([
        this.productRepo.getProductByStripeProductId(
          paymentRequestBody.productId,
        ),
        this.userRepository.getUserByUniqueId(paymentRequestBody.uniqueId),
      ]);

      let customerId = user.stripeCustomerId;
      // Call stripe create customer api first if the user data doesn't have the stripecustomerId
      // this would be good if the user abandons the payment and comse again
      if (!customerId) {
        let customer = await this.stripeService.CreateCustomer(
          user.email,
          user.name,
        );

        customerId = customer.id;

        // Update the usersTable with customerId created
        await this.userRepository.updateStripeCustomerId(
          paymentRequestBody.uniqueId,
          customerId,
        );
      }

      const [sessionData, priceData] = await Promise.all([
        this.createCheckoutSession(
          paymentRequestBody,
          uniquePaymentId,
          paymentRequestBody.uniqueId,
          JSON.stringify(productDbData),
          customerId,
        ),
        this.stripeService.getPrices(paymentRequestBody.priceId),
      ]);
      const userPayment = UserPaymentEntity.builder(paymentRequestBody.uniqueId)
        .withSessionId(sessionData['id'])
        .withUniquePaymentId(uniquePaymentId)
        .withProductId(priceData.product)
        .withPriceId(paymentRequestBody.priceId)
        .withUniqueProductMetaData(JSON.stringify(productDbData))
        .build();

      await this.userPayment.createUserPayment(userPayment);
      return new Response('success', sessionData, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In Inserting User Payment - ${error.toString},Module Name ${this.moduleName}`,
      );

      return new Response('failed', null, error);
    }
  }

  async getUserPayment(
    userUniqueId: string,
    uniquePaymentId: string,
  ): Promise<any> {
    try {
      let result = await this.userPayment.getUserPaymentByUniqueId(
        userUniqueId,
        uniquePaymentId,
      );
      // console.log("payment Intent",result);
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In getUserPayment - ${error.toString},Module Name ${this.moduleName}`,
      );
      return new Response('failed', null, error);
    }
  }

  async getAllUserPayments(userUniqueId: string): Promise<any> {
    try {
      let result = await this.userPayment.getAllUserPaymentsByUniqueId(
        userUniqueId,
      );
      // console.log("payment Intent",result);
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In Getting All User Payments - ${error.toString},Module Name ${this.moduleName}`,
      );
      return new Response('failed', null, error);
    }
  }

  async getAllUserActiveSubscriptions(userUniqueId: string): Promise<any> {
    try {
      let result = await this.subRepo.getSubscriptionByUserUniqueId(
        userUniqueId,
      );
      // console.log("payment Intent",result);
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In getAllUserActiveSubscriptions  - ${error.toString},Module Name ${this.moduleName}`,
      );
      return new Response('failed', null, error);
    }
  }

  // Subscription With Stripe Webhook Handler Part

  async CreateNewSubscriptionInDb(
    subscriptionId: string,
    price: number,
    customerId: string,
    invoiceURL: string,
    result: any,
    customerEmail: string,
    customerPaymentData: any,
  ) {
    const subData = await this.subService.createUserSubscription(
      subscriptionId,
      price,
      customerId,
      invoiceURL,
      result.metadata.userUniqueId,
      result.plan.product,
      result.plan.id,
      result.metadata.productMetaData,
      result.current_period_start,
      result.current_period_end,
      JSON.stringify(customerPaymentData),
    );

    // Calling external api service ---
    const external_api_result = await this.apiService.callExternalApi(
      'netzero',
      result.metadata.userUniqueId,
    );

    await this.emailServiceExternal.sendEmailWithTemplate(
      customerEmail,
      configData.sg_purchaseProduct_TemplateId,
      {
        planName: '',
        productName: '',
        customerEmail,
      },
      configData.adminEmail,
    );
  }

  async UpdateExistingSubscriptionInDb(
    subscriptionId: string,
    customerEmail: string,
  ) {
    const subData =
      await this.subService.updateUserSubscriptionBysubscriptionId(
        subscriptionId,
        { status: 'inActive' },
      );
    await this.emailServiceExternal.sendEmailWithTemplate(
      customerEmail,
      configData.sg_purchaseProduct_TemplateId,
      {
        planName: '',
        productName: '',
        customerEmail,
      },
      configData.adminEmail,
    );
  }
  /**
   * This inserts or updates the existing payment engtry for the user in the database
   */
  async InsertOrUpdateUserPaymentInDb(
    isNew: boolean,
    result: any,
    customerId: string,
    invoiceURL: string,
    price: number,
    userUniqueId: string,
    productMetaData: string,
  ) {
    if (!isNew) {
      let responseFromDb = await this.userPayment.updateUserPayment(
        result.status,
        result.metadata.payment_id,
        customerId,
        invoiceURL,
        price,
      );
      return;
    }

    /**
         * Write code for inserting new 
        payment entry ,this is needed in case the user is making the payment next time
        After purchasing the product once
         *  */

    const userPaymentEntity = new UserPaymentEntity(
      userUniqueId,
      '',
      'failed',
      '',
      '',
      customerId,
      '',
      price,
      invoiceURL,
      productMetaData,
    );
    await this.userPayment.createUserPayment(userPaymentEntity);
    return;
  }

  async updateUserPayment(
    subscriptionId: string,
    price: number,
    customerId: string,
    invoiceURL: string,
    customerEmail: string,
  ): Promise<any> {
    try {
      const existingSubscription =
        await this.subRepo.getSubscriptionBySubscriptionId(subscriptionId);
      let result = await this.stripeService.getSubscription(subscriptionId);
      /**
       * Brand New Subscription Entry
       */
      if (!existingSubscription) {
        if (result && result.status == 'active') {
         
          let customerPaymentData = await this.stripeService.getCardDetails(
            customerId,
            'card',
          );
          this.InsertOrUpdateUserPaymentInDb(
            false,
            result,
            customerId,
            invoiceURL,
            price,
            existingSubscription?.uniqueId || result.metadata.userUniqueId,
            existingSubscription?.productMetaData || customerPaymentData
          );
          let role = await this.roleRepository.getRoleByName(configData.deafultRole);
          // Update the user with this role
          await this.userRepository.updateUserRole(
            result.metadata.userUniqueId,
            role.id,
          );
          this.CreateNewSubscriptionInDb(
            subscriptionId,
            price,
            customerId,
            invoiceURL,
            result,
            customerEmail,
            customerPaymentData,
          );
        }
      } else {
        /**
         * Subscription Is Already there  And have to handle Payment Failed Scenario here
         */
        await this.InsertOrUpdateUserPaymentInDb(
          true,
          result,
          customerId,
          invoiceURL,
          price,
          existingSubscription.uniqueId,
          existingSubscription.productMetaData,
        );
        /**
         * Only the status of existing subscription is changed to inactive
         */
        await this.UpdateExistingSubscriptionInDb(
          subscriptionId,
          customerEmail,
        );
      }

      return true;
    } catch (error) {
      this.sentryService.logError(
        `Error In updateUserPayment  - ${error.toString},Module Name ${this.moduleName}`,
      );
      console.log(error);
      return error;
    }
  }

  async subscriptionUpdate(
    subscriptionId: string,
    price: number,
    customerId: string,
    invoiceURL: string,
  ): Promise<any> {
    try {
      const existingSubscription =
        await this.subRepo.getSubscriptionBySubscriptionId(subscriptionId);

      let result = await this.stripeService.getSubscription(subscriptionId);
      if (result && existingSubscription) {
        // Just update the existing subscription
        const updateData =
          await this.subService.updateUserSubscriptionBysubscriptionId(
            subscriptionId,
            {
              priceId: result.plan.id,
              price: price,
              invoiceURL,
              customerId,
              subscriptionStartTime: result.current_period_start,
              subscriptionEndTime: result.current_period_end,
              productMetaData: result.metadata.productMetaData,
            },
          );
      }

      return true;
    } catch (error) {
      this.sentryService.logError(
        `Error In updating Subscription  - ${error.toString},Module Name ${this.moduleName}`,
      );
      console.log(error);
      return error;
    }
  }

  // Upodates the subscription's status active or inactive
  async subscriptionStatusUpdate(
    userUniqueId: string,
    status: string,
  ): Promise<any> {
    try {
      // Get existing subscription from the db
      let existingSubscription =
        this.subRepo.getSubscriptionByUserUniqueId(userUniqueId);
      // if the subscription exists that means user is upgrading or downgrading the subscription
      if (existingSubscription) {
        // update the new price Id
        await this.subRepo.updateSubscriptionStatusByUniqueId(
          userUniqueId,
          status,
        );
      }

      return true;
    } catch (error) {
      this.sentryService.logError(
        `Error In updating Subscription  - ${error.toString},Module Name ${this.moduleName}`,
      );
      console.log(error);
      return error;
    }
  }

  async updateUserPaymentUserCancelled(unqiuePaymentId: string): Promise<any> {
    try {
      let responseFromDb =
        await this.userPayment.updateUserPaymentUserCancelled(
          'user_cancelled',
          unqiuePaymentId,
        );
      return new Response('success', responseFromDb, null);
    } catch (error) {
      this.sentryService.logError(
        `Error In updateUserPaymentUserCancelled  - ${error.toString},Module Name ${this.moduleName}`,
      );
      console.log(error);
      return new Response('failed', null, error);
    }
  }
  // this gets all the prices list
  async getAllPrices(): Promise<Response> {
    try {
      // Update the product here with relevant information
      let products = await this.priceRepo.findAll();

      return new Response('success', products, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(
        `Error In getallPrices  - ${error.toString},Module Name ${this.moduleName}`,
      );
      return new Response('success', null, error);
    }
  }
}
