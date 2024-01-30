import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { configData } from 'src/config';
import { EmailDtoCustomer } from 'src/domain/dtos/email.dto';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(configData.sendGridKey);
  }

  sendMail(message: EmailDtoCustomer): Promise<any> {
    return sgMail.send(message);
  }

  async sendEmailWithTemplate(
    to: string,
    templateId: string,
    dynamic_template_data: object,
    from: string,
  ) {
   
    const msg = {
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      templateId: templateId,
      dynamic_template_data: dynamic_template_data,
    };

    try {
      let data = await sgMail.send(msg);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
