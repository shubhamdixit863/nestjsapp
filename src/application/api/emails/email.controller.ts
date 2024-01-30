import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AzureAuthServiceMiddleware } from 'src/infrastructure/azure/azure.auth.servicemiddleware';
import EmailSendingService from './emailsending.service';
import {  EmailDtoCustomer, TEmailDtoCustomer, TEmailDtoTwo } from 'src/domain/dtos/email.dto';

@ApiBearerAuth() //edit here
@Controller('/email')
@ApiTags('email')
@UseGuards(AzureAuthServiceMiddleware)
export default class EmailController {
  constructor(private emailSendinService: EmailSendingService) {}

  @Post('/send')
  cancelSubscription(@Body() emailBody: EmailDtoCustomer) {
    return this.emailSendinService.sendEmail(emailBody);
  }

 

  // This sends email to truworld admin as notification about the form being submitted
  @Post('/twoAdmin')
  @ApiBody({ type: TEmailDtoTwo })
  emailWithTemplateToTwoAdmin(@Body() emailBody: TEmailDtoTwo) {
  //  console.log(emailBody)

    return this.emailSendinService.sendEmailWithTemplatetoTwo(emailBody);
  }

    // This sends email to customer  as notification about the form being submitted

  @Post('/customer')
  @ApiBody({ type: TEmailDtoCustomer })
  emailWithTemplateToCustomer(@Body() emailBody: TEmailDtoCustomer) {
   // console.log(emailBody)
    return this.emailSendinService.sendEmailWithTemplatetoCustomer(emailBody);
  }
}
