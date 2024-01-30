import { Inject, Injectable } from '@nestjs/common';
import SubscriptionRepositoryPostgres from 'src/domain/adapters/subscription.repository.impl';
import { Response } from 'src/domain/dtos/response.dto';
import Subscription from 'src/domain/entity/SubscriptionEntity';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';

@Injectable()
export default class SubscriptionService {
  moduleName="Subscription Service";

  constructor(
    @Inject('SubscriptionRepository')
    private subRepo: SubscriptionRepositoryPostgres,
    private readonly sentryService: SentryService,  // Inject the SentryService
  ) {}

  async createUserSubscription(
    subscriptionId: string,
    price: number,
    customerId: string,
    invoiceURL: string,
    userUniqueId:string,
    productId:string,
    priceId:string,
    productMetaData:string,
    subscriptionStartTime:number,
    subscriptionEndTime:number,
    paymentMethodsData:string,
  ): Promise<any> {
    try {
      this.sentryService.logInfo('Creating user subscription...');  // Log the information
      const subEntity = new Subscription(userUniqueId,subscriptionId,productId,priceId,invoiceURL,customerId,price,productMetaData,subscriptionStartTime,subscriptionEndTime,paymentMethodsData);
      let result = await this.subRepo.createSubscription(subEntity);
      this.sentryService.logInfo('User subscription created.');  // Log the successful creation
      return result;
    } catch (error) {
      console.log(error);
      this.sentryService.logError(error);  // Log the error
      return error;
    }
  }


  async updateUserSubscriptionBysubscriptionId(
    subscriptionId: string,
   data:any
  ): Promise<any> {
    try {
      this.sentryService.logInfo('Updating user subscription...');  // Log the information
      let result = await this.subRepo.updateSubscriptionBySubscriptionId(subscriptionId,data);
      this.sentryService.logInfo('User subscription updated.');  // Log the successful creation
      return result;
    } catch (error) {
      console.log(error);
      this.sentryService.logError(error);  // Log the error
      return error;
    }
  }

  async getUserSubscription(
    userUnqiueId: string,
  ): Promise<any> {
    try {
      this.sentryService.logInfo('Getting user subscription...');  // Log the information
      let result = await this.subRepo.getSubscriptionByUserUniqueId(userUnqiueId);
      this.sentryService.logInfo('User subscription fetched.');  // Log the successful fetch
      return new Response("success",result,null);
    } catch (error) {
      this.sentryService.logError(error);  // Log the error
      return new Response("failed",null,error.toString());
    }
  }

  async getUserSubscriptionBysubscriptionId(
    subscriptionId: string,
  ): Promise<any> {
    try {
      this.sentryService.logInfo('Getting user subscription by Id...');  // Log the information
      let result = await this.subRepo.getSubscriptionBySubscriptionId(subscriptionId);
      this.sentryService.logInfo('User subscription By Id fetched.');  // Log the successful fetch
      console.log("subscription result-----",result);
      return new Response("success",result,null);
    } catch (error) {
      this.sentryService.logError(error);  // Log the error
      return new Response("failed",null,error.toString());
    }
  }
}
