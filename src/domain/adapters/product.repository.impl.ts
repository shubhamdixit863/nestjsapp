import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { ProductRepository } from '../ports/product.repository';
import { ProductEntity } from '../entity/ProductEntity';
@Injectable()
export default class ProductRepositoryPostGres implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async updateProduct(productEntity: ProductEntity): Promise<any> {
    try {
      return await this.prisma.product.update({
        where: {
          productId: productEntity.productId,
        },
        data: productEntity,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductByStripeProductId(stripeProductId: string): Promise<any> {
    try {
      return await this.prisma.product.findFirst({
        where: {
          productId: stripeProductId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createProduct(product: ProductEntity): Promise<any> {
    try {
      return await this.prisma.product.create({ data: product });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(Id: number): Promise<any> {
    try {
      return await this.prisma.product.findUnique({
        where: {
          id: Id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllProducts(): Promise<any> {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          prices: true,
        },
      });

      // map through the products and transform features string into an array
      return products.map((product) => ({
        ...product,
        prices: product.prices.map((price) => ({
          ...price,
          features: price.features.split(','),
        })),
      }));
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
