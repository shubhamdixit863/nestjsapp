import { Inject, Injectable } from '@nestjs/common';
import { AssignRolesDTO } from 'src/domain/dtos/admin.assignRole.dto';
import {
  AzureDtoUser,
  CreateUserDto,
} from 'src/domain/dtos/azure.graphuser.dto';
import {
  CreatePriceDto,
  CreateProductDto,
} from 'src/domain/dtos/createproduct.dto';
import { Response } from 'src/domain/dtos/response.dto';
import { CreateRoleDto } from 'src/domain/dtos/role.dto';
import { SubscriptionLicenseDto } from 'src/domain/dtos/subscriptionlicense.dto';
import { Price } from 'src/domain/entity/PriceEntity';
import { ProductEntity } from 'src/domain/entity/ProductEntity';
import { UserEntity } from 'src/domain/entity/UserEntity';
import { PriceRepository } from 'src/domain/ports/price.repository';
import { ProductRepository } from 'src/domain/ports/product.repository';
import { RoleRepository } from 'src/domain/ports/role.repository';
import { UserRepository } from 'src/domain/ports/user.repository';
import { AzureGraphService } from 'src/infrastructure/azure/azure.graph.service';
import { StripeService } from 'src/infrastructure/stripe/stripe.service';
import { v4 as uuidv4 } from 'uuid';
import { merge } from 'lodash';


@Injectable()
export class AdminService {
  constructor(
    @Inject('RoleRepository') private readonly roleRepo: RoleRepository,
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
    @Inject('PriceRepository') private readonly priceRepo: PriceRepository,

    private readonly azureGraph: AzureGraphService,
    private readonly stripeService: StripeService,
  ) {}

  async createRole(roleDto: CreateRoleDto): Promise<Response> {
    try {
      let result = await this.roleRepo.createRole(
        CreateRoleDto.toEntity(roleDto),
      );
      return new Response('success', result, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  async getRoles(): Promise<Response> {
    try {
      let result = await this.roleRepo.getRoles();
      return new Response('success', result, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  async assignRole(assignRole: AssignRolesDTO): Promise<Response> {
    try {
      let result = await this.userRepo.updateUserRole(
        assignRole.userId,
        assignRole.roleId,
      );
      return new Response('success', result, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  async getUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<Response> {
    try {
      let result = await this.userRepo.getUsersPaginated(page, limit, search);
      return new Response('success', result, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  async createUser(createUser: AzureDtoUser): Promise<Response> {
    try {
      let user = new CreateUserDto(createUser, uuidv4());
      let result = await this.azureGraph.createUser(user);
      if (result.statusCode == 400) {
        return new Response('failed', null, result.body);
      }
      // creating user in the database as well
      let dbUser = await this.userRepo.createUser(
        AzureDtoUser.toEntity(createUser, result.id),
        createUser.roleId,
      );
      dbUser.password = user.passwordProfile.password; // return the password of the user for logging in

      // Updating its role in the db

      return new Response('success', dbUser, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }



  async updateUser(id: string, updateUser: AzureDtoUser): Promise<Response> {
    try {
      // Update the user in Azure Graph
      
      let result = await this.azureGraph.updateUser(id, updateUser);
      if (result.statusCode == 400) {
        return new Response('failed', null, result.body);
      }
  
      // Convert updateUser to entity and remove fields with empty strings
      let updateUserEntity = AzureDtoUser.toEntity(updateUser, id);
      Object.keys(updateUserEntity).forEach(key => {
        if (updateUserEntity[key] === '') {
          delete updateUserEntity[key];
        }
      });
  
      // Retrieve the existing user data from the database
      let existingDbUser = await this.userRepo.getUserByUniqueId(id);
      if (!existingDbUser) {
        return new Response('failed', null, 'User not found in the database');
      }
  
      // Merge the existing user data with the updates
      let updatedDbUser = merge({}, existingDbUser, updateUserEntity);
      delete updatedDbUser.roles
  
      // Save the updated user data back to the database
      console.log(updateUser);
      let savedDbUser = await this.userRepo.updateUserByUniqueId(id, updatedDbUser);
  
      return new Response('success', savedDbUser, null);
    } catch (error) {
      console.log(error);
      return new Response('failed', null, error.toString());
    }
  }
  


  async updateUser_deprecated(id: string, updateUser: AzureDtoUser): Promise<Response> {
    try {
      let result = await this.azureGraph.updateUser(id, updateUser);
      if (result.statusCode == 400) {
        return new Response('failed', null, result.body);
      }

      let dbUser = await this.userRepo.updateUserByUniqueId(
        id,
        AzureDtoUser.toEntity(updateUser, result.id),
      );

      return new Response('success', dbUser, null);
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  async deleteUser(id: string, updateUser: AzureDtoUser): Promise<Response> {
    try {
      let result = await this.azureGraph.userSoftDelete(id, updateUser);
      if (result.statusCode == 400) {
        return new Response('failed', null, result.body);
      }
    } catch (error) {
      return new Response('failed', null, error.toString());
    }
  }

  // Product And Pricing stripe

  async createStripeProduct(productDto: CreateProductDto): Promise<Response> {
    try {
      let product = await this.stripeService.createProduct(
        productDto.name,
        productDto.description,
        [productDto.productImage],
      );

      const productEntity = new ProductEntity(
        product.id,
        productDto.productImage,
        new Date(),
        new Date(),
        true,
        productDto.name,
        productDto.description,
      );
      let result = await this.productRepo.createProduct(productEntity);
      return new Response('success', result, null);
    } catch (error) {
      console.log(error);
      return new Response('success', null, error);
    }
  }

  async createStripePrice(priceDto: CreatePriceDto): Promise<Response> {
    try {
      let [price, productDb] = await Promise.all([
        this.stripeService.createPrice(
          priceDto.price,
          priceDto.currency,
          priceDto.productId,
          priceDto.tenure,
        ),
        this.productRepo.getProductByStripeProductId(priceDto.productId),
      ]);

      // Update the product here with relevant information
      let dbPrice = await this.priceRepo.create(
        new Price(
          price.id,
          priceDto.currency,
          priceDto.tenure,
          priceDto.description,
          priceDto.price,
          priceDto.productId,
          productDb.id,
          true,
          priceDto.planType,
          priceDto.features.join(",")
        ),
      );

      return new Response('success', dbPrice, null);
    } catch (error) {
      console.log(error);
      return new Response('success', null, error);
    }
  }

  async getAllProducts(): Promise<Response> {
    try {
      // Update the product here with relevant information
      let products = await this.productRepo.getAllProducts();

      return new Response('success', products, null);
    } catch (error) {
      console.log(error);
      return new Response('success', null, error);
    }
  }

  async getAllPrices(): Promise<Response> {
    try {
      // Update the product here with relevant information
      let products = await this.priceRepo.findAll();

      return new Response('success', products, null);
    } catch (error) {
      console.log(error);
      return new Response('success', null, error);
    }
  }

  // Create Subscription License for the user

  async createSubscriptionLicense(
    subscriptionLicense: SubscriptionLicenseDto,
  ): Promise<Response> {
    try {
      // Get user details from the uniqueId provided
      const user = await this.userRepo.getUserByUniqueId(
        subscriptionLicense.userUniqueId,
      );
      // If the userDetails Doesn't have the stripeCustomerId then create the stripe user and Update the user table with stripeCustomerId
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const stripeCustomer = await this.stripeService.CreateCustomer(
          user.email,
          user.name,
        );
        stripeCustomerId = stripeCustomer.id;
      }

      // Call the stripe subscription Api
      let stripeSubscription =
        await this.stripeService.CreateIndirectLicenseSubscription(
          stripeCustomerId,
          subscriptionLicense.stripePriceId,
          subscriptionLicense.userUniqueId

        );

      return new Response('success', stripeSubscription, null);
    } catch (error) {
      console.log(error);
      return new Response('success', null, error);
    }
  }
}
