import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as msal from '@azure/msal-node';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import {configData} from "../../config";
import { SentryService } from "../sentry/sentry.service";
const DISCOVERY_KEYS_ENDPOINT = configData.DISCOVERY_KEYS_ENDPOINT;

const config: msal.Configuration = {
    auth: {
      clientId: configData.clientId,
      authority: configData.authority,
      clientSecret: configData.clientSecret,
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel: msal.LogLevel, message: string, containsPii: boolean): void {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      },
    },
  };
// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);


@Injectable()
export class AzureAuthServiceMiddleware implements CanActivate{
  constructor( private readonly sentryService:SentryService){

  }

      


   
    validateJwt(token: string, callback: (err: Error | null, data: any) => void) {
      console.log("came")
      //https://trueworldorganization.b2clogin.com/e63dac64-87bc-4513-8b19-6cfd875caad3/v2.0/
        const validationOptions: jwt.VerifyOptions = {
            audience: configData.clientId, // v2.0 token
            issuer: configData.azureIssuer_for_Validating_token, // v2.0 token
        };
    
        jwt.verify(token, this.getSigningKeys, validationOptions, (err, data) => {
            if (err) {
              this.sentryService.logError(err);
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    };
    
    getSigningKeys(header: jwt.JwtHeader, callback: (err: Error | null, data: any) => void) {
        const client = jwksClient({
            jwksUri: DISCOVERY_KEYS_ENDPOINT,
        });
    
        client.getSigningKey(header.kid, (err, key) => {
            
            if (err) {
                callback(err, null);
            } else {
                const signingKey = key.getPublicKey();
                callback(null, signingKey);
            }
        });
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
      const req = context.switchToHttp().getRequest();
     // console.log(req.headers);
      const token = req.headers.authorization?.split(' ')[1] || '';
  
      return new Promise<boolean>((resolve, reject) => {
        this.validateJwt(token, (err, data) => {
          if (err) {
           //console.log(err);
            resolve(false);
          } else {
            req.user = data;
            resolve(true);
          }
        });
      });
    }
    
}