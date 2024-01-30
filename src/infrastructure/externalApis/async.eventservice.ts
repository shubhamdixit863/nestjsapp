import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import EmailSendingService from 'src/application/api/emails/emailsending.service';
import { EmailService } from './email.service.external';


// this is asynchronous event service to send emails or any events in the background


@Injectable()
export class AsyncEventService extends EventEmitter {
  constructor(
    private readonly emailService:EmailService
  ) {
    super();

    // Attach event listener inside the constructor
    this.on('emailSent', (payload:any) => {
   
      // email to be sent here 
  //    this.emailService.sendEmailWithTemplate(...payload)
      
      console.log('Email sent event received', payload);
    });
  }

  sendEmail(payload: any) {
    // Here you can do actual email sending
    // After that emit event
    this.emit('emailSent', payload);
  }
}
