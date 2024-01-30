import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { configData } from 'src/config';

// This calls external apis 

@Injectable()
export class ApiService {
  async callExternalApi(apiName: string, externalId: string): Promise<AxiosResponse> {

    switch (apiName) {
      case 'netzero':
        try {
          return await this.callNetZeroApi(externalId);
        } catch (error) {
          throw new Error(error);

        }
     
      
      default:
        throw new Error('Invalid API name');
    }
  }

  private async callNetZeroApi(externalId: string): Promise<AxiosResponse> {
    try {
      const url = configData.netZeroUrl;
      const apiKey = '27a9898e-c633-424f-97b7-2b27c8a8b09c';
  
      const headers = {
        'ApiKey': apiKey,
      };
  
      const body = {
        'ExternalId': externalId
      };
  
      return await axios.post(url, body, { headers });
      
    } catch (error) {
      throw new Error(error);
    }
 
  }
}
