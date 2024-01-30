/**
 * 
 * Azure Graph Service Apis
 */

import { Injectable } from '@nestjs/common';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-client';
import { AzureAuthProvideForGraphService } from './azuregraph.auth';
import * as fs from 'fs';


@Injectable()
export class AzureGraphService {
  private client: MicrosoftGraph.Client;

  constructor() {
    const clientOptions = {
      authProvider: new AzureAuthProvideForGraphService(),
    };

    this.client = MicrosoftGraph.Client.initWithMiddleware(clientOptions);
  }

  async getUsers(): Promise<any> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.client.api('/users').get();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUser(id: string): Promise<any> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.client
        .api(`/users/${id}`)
        .select(
          'displayName,givenName,postalCode,identities,email,city,country',
        )
        .get();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.client.api(`/users/${id}`).delete();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async userSoftDelete(id: string, status: any): Promise<any> {
    try {
      return await this.client.api(`/users/${id}`).patch(status);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateUser(id: string, prop: any): Promise<any> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.client.api(`/users/${id}`).patch(prop);
    } catch (error) {
      console.log(error);
      return error;
    }
  }


  async createUser(user: any): Promise<any> {
    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await this.client.api('/users').post(user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createUsersFromFile(path: string): Promise<any> {
    let users = JSON.parse(fs.readFileSync(path, 'utf8'));

    try {
      console.log('Graph API called at: ' + new Date().toString());
      return await Promise.all(
        users.map(async (user) => {
          return await this.client.api('/users').post(user);
        }),
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
