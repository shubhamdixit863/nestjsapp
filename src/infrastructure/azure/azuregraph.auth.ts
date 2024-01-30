import * as msal from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { configData } from 'src/config';

@Injectable()
export class AzureAuthProvideForGraphService {
  private cca: msal.ConfidentialClientApplication;

  constructor() {
    this.cca = new msal.ConfidentialClientApplication(configData.msalConfig);
  }

  async getAccessToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const authResponse = await this.cca.acquireTokenByClientCredential(
        configData.tokenRequest,
      );

      if (authResponse.accessToken && authResponse.accessToken.length !== 0) {
        resolve(authResponse.accessToken);
      } else {
        reject(Error('Error: cannot obtain access token.'));
      }
    });
  }

  async getAccessTokenByUsernamePassword(email:string,password:string): Promise<string> {
    try {
      const tokenRequest: msal.UsernamePasswordRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
        username: email, // Replace with the user's email address
        password: password, // Replace with the user's password
      };
  
      const authResponse = await this.cca.acquireTokenByUsernamePassword(tokenRequest);
  
      if (authResponse && authResponse.accessToken) {
        return authResponse.accessToken;
      } else {
        throw new Error('Error: Cannot obtain access token.');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
