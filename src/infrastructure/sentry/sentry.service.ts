import { Injectable } from "@nestjs/common";
import * as Sentry from "@sentry/node";

// Sentry Service to be used at all places like services and error where the exception happens

@Injectable()
export class SentryService {
  public logError(err: any): void {
    Sentry.captureException("Api-"+err);
  }

  public logInfo(event: any): void {
    Sentry.captureEvent({"environment":"Production",message:`Api-${event}`});
  }

}