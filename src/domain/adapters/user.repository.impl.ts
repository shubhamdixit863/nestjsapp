import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entity/UserEntity';
import { UserRepository } from '../ports/user.repository';
@Injectable()
export default class UserRepositoryPostGres implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUsersPaginated(page: number=1, limit: number=10, search: string): Promise<any> {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              name: {
                startsWith: search,
              },
            },
          ],
        },
        include: {
          roles: true,
        },
        skip: (page-1)*limit,
        take: Number(limit),
      });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStripeCustomerId(uniqueId: string, stripeCustomerId: string): Promise<any> {
    try {
      return await this.prisma.users.update({
        where: { uniqueId },
        data: {stripeCustomerId},
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserByUniqueId(uniqueId: string, user: UserEntity): Promise<any> {
    try {
      return await this.prisma.users.update({
        where: { uniqueId },
        data: user,
      });
    } catch (error) {
      throw new Error(error);
    }
  }



  async updateProfilePic(uniqueId: string, avtarUrl: string): Promise<any> {
    try {
      return await this.prisma.users.update({
        where: { uniqueId },
        data: { avtarUrl },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByUniqueId(uniqueId: string): Promise<any> {
    try {
      return await this.prisma.users.findUnique({
        where: {
          uniqueId: uniqueId,
        },
        include: {
          roles: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(user: UserEntity, roleId: number): Promise<any> {
    try {
      console.log(roleId);
      return await this.prisma.users.create({
        data: {
          ...user,
          roles: {
            connect: {
              id: roleId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserRole(uniqueId: string, roleId: number): Promise<any> {
    try {
      return await this.prisma.users.update({
        where: { uniqueId },
        data: {
          roles: {
            connect: {
              id: roleId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
