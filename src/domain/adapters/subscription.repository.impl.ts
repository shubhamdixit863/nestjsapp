import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { SubscriptionRepository } from "../ports/subscription.repository";
import { Injectable } from "@nestjs/common";
import Subscription from "../entity/SubscriptionEntity";

@Injectable()
export default class SubscriptionRepositoryPostgres implements SubscriptionRepository{
    constructor( private prisma: PrismaService) {}
  async updateSubscriptionBySubscriptionId(subscriptionId: string,data:any) {

    try {
      return await this.prisma.userSubscriptions.update({
        where:{
          subscriptionId:subscriptionId
        },
        data:data
      });
    } catch (error) {
      throw new Error(error.toString());
    }
    
  }
 async  getSubscriptionBySubscriptionId(subscriptionId: string): Promise<any> {
  try {
    return await this.prisma.userSubscriptions.findUnique({
      where:{
        subscriptionId:subscriptionId
      }
    });
  } catch (error) {
    throw new Error(error.toString());
  }
   
  }
  async updateSubscriptionStatusByUniqueId(userUnqiueId: string,status:string) {
    try {
      return await this.prisma.userSubscriptions.updateMany({
        where:{
          uniqueId:userUnqiueId
        },
        data:{
        status:status
        }
      });
    } catch (error) {
      throw new Error(error.toString());
    }
  }
  
    async updateSubscriptionByUniqueId(userUnqiueId: string, priceId: string): Promise<any> {
      try {
        return await this.prisma.userSubscriptions.updateMany({
          where:{
            uniqueId:userUnqiueId
          },
          data:{
            priceId
          }
        });
      } catch (error) {
        throw new Error(error.toString());
      }
    }

    async deleteSubscriptionByUserUniqueId(Id:string,subId:string): Promise<any> {
      try {
        return await this.prisma.userSubscriptions.updateMany({
          where: {
            uniqueId: Id,
            subscriptionId:subId
          },
          data: {
            status: 'inactive',
          },
        });
      } catch (error) {
        throw new Error(error.toString());
      }
    }

    async createSubscription(subscription: Subscription): Promise<any> {
      try {
        return await this.prisma.userSubscriptions.create({data:subscription});
      } catch (error) {
        throw new Error(error.toString());
      }
    }

    async getSubscriptionByUserUniqueId(Id: string): Promise<any> {
      try {
        return await this.prisma.userSubscriptions.findMany({
          where:{
            uniqueId:Id
          }
        });
      } catch (error) {
        throw new Error(error.toString());
      }
    }
}  
