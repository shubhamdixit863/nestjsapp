import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Price } from '../entity/PriceEntity';
import { PriceRepository } from '../ports/price.repository';
import { Injectable } from '@nestjs/common';
import { SentryService } from 'src/infrastructure/sentry/sentry.service';
@Injectable()
export class PriceRepositoryImpl implements PriceRepository {
  constructor(private prisma: PrismaService,private readonly sentryService: SentryService) {}

  async create(price: Price): Promise<Price> {
    try {
      return this.prisma.price.create({
        data: {
          priceId: price.priceId,
          currency: price.currency,
          tenure: price.tenure,
          description: price.description,
          price: price.price,
          stripeProductId: price.stripeProductId,
          isActive: price.isActive,
          features: price.features,
          planType: price.planType,
          product: {
            connect: { id: price.productId },
          },
        },
      });
    } catch (error) {
      this.sentryService.logError("Error in Price Repository Create Price"+error.toString());
      throw new Error(error.toString());
    }
  }

  async findById(id: number): Promise<Price | null> {
    throw new Error('Not implemented');
  }

  async findAll(): Promise<Price[]> {
    return this.prisma.price.findMany();
  }

  async updateById(id: number, price: Price): Promise<void> {
    throw new Error('Not implemented');
  }

  async deleteById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
