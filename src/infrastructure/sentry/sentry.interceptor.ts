import {
    ExecutionContext,
    Injectable,
    NestInterceptor,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import * as Sentry from '@sentry/core';
  
// Only For Controllers this should be used as UseInterceptor

  @Injectable()
  export class SentryInterceptor implements NestInterceptor {
  
    intercept( context: ExecutionContext, next: CallHandler): Observable<any> {
      return next
        .handle()
        .pipe(
          tap(null, (exception) => {
            // CAPTURE ERROR IN SENTRY
            Sentry.captureException(exception);
          }),
        );
    }
  
  }
