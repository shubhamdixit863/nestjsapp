import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { UserPaymentRepository } from '../ports/userPayment.repository';
import { UserPaymentEntity } from '../entity/UserPaymentEntity';
@Injectable()
export default class UserPaymentRepositoryPostGres
  implements UserPaymentRepository
{
  // We have created our own wrapper over prisma service
  constructor(private prisma: PrismaService) {}
  async updateUserPaymentUserCancelled(
    status: string,
    uniquePaymentId: string,
  ): Promise<any> {
    try {
      return await this.prisma.userPayments.updateMany({
        where: {
          uniquePaymentId,
        },
        data: { paymentStatus: status },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllUserPaymentsByUniqueId(uniqueId: string): Promise<any> {
    try {
      return await this.prisma.userPayments.findMany({
        where: {
          uniqueId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateUserPayment(
    status: string,
    uniquePaymentId: string,
    customerId: string,
    invoiceUrl: string,
    amount: number,
  ): Promise<any> {
    try {
      return await this.prisma.userPayments.updateMany({
        where: {
          uniquePaymentId,
        },
        data: { paymentStatus: status, customerId, invoiceUrl, amount },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUserPayment(userPayment: UserPaymentEntity): Promise<any> {
    try {
      return await this.prisma.userPayments.create({ data: userPayment });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserPaymentByUniqueId(
    uniqueId: string,
    uniquePaymentId: string,
  ): Promise<any> {
    try {
      return await this.prisma.userPayments.findFirst({
        where: {
          uniqueId,
          uniquePaymentId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
