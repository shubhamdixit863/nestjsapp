import { Injectable } from '@nestjs/common';
import { configData } from 'src/config';
import { EmailDtoCustomer,  TEmailDtoCustomer, TEmailDtoTwo } from 'src/domain/dtos/email.dto';
import { Response } from 'src/domain/dtos/response.dto';
import { EmailService } from 'src/infrastructure/externalApis/email.service.external';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';
const Module: string = 'EmailSendingService';

@Injectable()
export default class EmailSendingService {
  constructor(
    private emailService: EmailService,
    private readonly sentryService: SentryService,
  ) {}

  async sendEmail(emailData: EmailDtoCustomer) {
    try {
      let data = await this.emailService.sendMail(emailData);

      return new Response('success', data, null);
    } catch (error) {
      this.sentryService.logError(`${Module},${error}`);

      return new Response('failed', '', error);
    }
  }

  async sendEmailWithTemplatetoTwo(emailDatas: TEmailDtoTwo) {
    try {
      let data = await this.emailService.sendEmailWithTemplate(
        emailDatas.to,
        emailDatas.templateId,
        emailDatas,
        emailDatas.from.from,
      );

      return new Response('success', data, null);
    } catch (error) {
      this.sentryService.logError(`${Module},${error}`);

      return new Response('failed', '', error);
    }
  }

  async sendEmailWithTemplatetoCustomer(emailDatas: TEmailDtoCustomer) {
    try {
      let data = await this.emailService.sendEmailWithTemplate(
        emailDatas.to,
        emailDatas.templateId,
        emailDatas,
        emailDatas.from.from,
      );

      return new Response('success', data, null);
    } catch (error) {
      return new Response('failed', '', error);
    }
  }
}
