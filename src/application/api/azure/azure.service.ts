import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import SubscriptionRepositoryPostgres from 'src/domain/adapters/subscription.repository.impl';
import { RoleRepository } from 'src/domain/ports/role.repository';
import { UserRepository } from 'src/domain/ports/user.repository';
import axios from 'axios';
import { AzureAuthProvideForGraphService } from 'src/infrastructure/azure/azuregraph.auth';
import { StripeService } from 'src/infrastructure/stripe/stripe.service';
import { v4 as uuidv4 } from 'uuid';
import { configData } from 'src/config';
import { Response } from 'src/domain/dtos/response.dto';
import * as qs from 'qs';
import { RoleConverter } from 'src/infrastructure/utils';
import { EmailService } from 'src/infrastructure/externalApis/email.service.external';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';
@Injectable()
export default class AzureService {
  moduleName="Azure Service"
  constructor(
    @Inject('SubscriptionRepository')
    private subRepo: SubscriptionRepositoryPostgres,
    private azureAuth: AzureAuthProvideForGraphService,
    @Inject('UserRepository') private userRepo: UserRepository,
    @Inject('RoleRepository') private roleRepo: RoleRepository,
    private readonly sentryService:SentryService,
    private emailService: EmailService,
  ) {}

  async getUserSubscription(userUnqiueId: string): Promise<any> {
    try {
      let result = await this.subRepo.getSubscriptionByUserUniqueId(
        userUnqiueId,
      );
      let productIds = result.map((ele) => ele.productId);
      return productIds.join(',');
    } catch (error) {
      this.sentryService.logError(`Error In Getting User Subscription - ${error.toString},Module Name ${this.moduleName}`)
      return null;
    }
  }

  async GetUserPermissions(userUnqiueId: string): Promise<any> {
    try {
      let result = await this.userRepo.getUserByUniqueId(userUnqiueId);
      let roleConverter = new RoleConverter(result.roles);
      return {
        permissions: roleConverter.convertToStringPermissions(),
        roles: roleConverter.convertToStringRole(),
      };
    } catch (error) {
      this.sentryService.logError(`Error In Getting User Permissions - ${error.toString},Module Name ${this.moduleName}`)

      return null;
    }
  }

  async GetAccessTokenAzure(code: string) {
    const data = {
      grant_type: configData.grant_type,
      client_id: configData.client_id,
      scope: configData.scope,
      code: code,
      redirect_uri: configData.redirect_uri,
      client_info: configData.client_info,
      code_verifier: configData.code_verifier,
    };

    const encodedData = qs.stringify(data);

    try {
      const response = await axios({
        method: 'post',
        url: configData.token_url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: encodedData,
      });

      return new Response('success', response.data, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(`Error In Getting Azure Access Token - ${error.toString},Module Name ${this.moduleName}`)

      return new Response('failed', null, error.toString());
    }
  }

  async GetRefereshTokenAzure(refresh_token: string) {
    const data = {
      grant_type: configData.grant_type_refresh,
      client_id: configData.client_id,
      scope: configData.scope,
      refresh_token: refresh_token,
      redirect_uri: configData.redirect_uri,
    };

    const encodedData = qs.stringify(data);

    try {
      const response = await axios({
        method: 'post',
        url: configData.token_url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: encodedData,
      });

      return new Response('success', response.data, null);
    } catch (error) {
      console.log(error);
      this.sentryService.logError(`Error In Getting Refresh Token Azure - ${error.toString},Module Name ${this.moduleName}`)

      return new Response('failed', null, error.toString());
    }
  }


  // Send Welcome email service --->

  async sendWelcomeEmail(emailId:string ,name:string){
    try {
      const data=await this.emailService.sendEmailWithTemplate(emailId,configData.welcomeEmailTemplateId,{email:emailId,name},configData.adminEmail)

      return new Response('success',data, null);

      
    } catch (error) {
      this.sentryService.logError(`Error In Sending Welcome Email - ${error.toString},Module Name ${this.moduleName}`)

      return new Response('failed', null, error.toString());

    }

  }


}
