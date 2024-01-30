import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { CreateRoleDto } from "src/domain/dtos/role.dto";
import { AssignRolesDTO } from "src/domain/dtos/admin.assignRole.dto";
import { AzureDtoUser, CreateUserDto } from "src/domain/dtos/azure.graphuser.dto";
import { CreatePriceDto, CreateProductDto } from "src/domain/dtos/createproduct.dto";
import { SubscriptionLicenseDto } from "src/domain/dtos/subscriptionlicense.dto";

  @Controller('/admin')
  @ApiTags('Admin Apis ---------')
  export default class AdminController {
    constructor(
      private readonly adminService:AdminService
 
    ) {}

    @Post("/role")
    createRole(@Body() createRoleDto: CreateRoleDto){
    
      return this.adminService.createRole(createRoleDto);
    }

    @Get("/role")
    getRoles(){
    
      return this.adminService.getRoles();
    }

    @Get("/users")
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    findAllUsers(
      @Query('page') page: number=1,
      @Query('limit') limit: number=10,
      @Query('search') search: string='',
    ) {

    return   this.adminService.getUsers(page,limit,search)
    
    }

    @Post("/assignRole")
    assignRole(@Body() assignRole: AssignRolesDTO){
    
      return this.adminService.assignRole(assignRole);
    }

    @Post("/createUser")
    createUser(@Body() createUser: AzureDtoUser){
    
      return this.adminService.createUser(createUser);
    }

    @Patch("/updateUser/:uniqueId")
    @ApiParam({name: 'uniqueId', required: true, description: 'uniqueId of the user', schema: { oneOf: [{type: 'string'}]}})
    updateUser(@Param('uniqueId') uniqueId, @Body() updateUser: AzureDtoUser){
    
      return this.adminService.updateUser(uniqueId, updateUser);
    }

    @Delete("/deleteUser/:uniqueId")
    @ApiParam({name: 'uniqueId', required: true, description: 'uniqueId of the user', schema: { oneOf: [{type: 'string'}]}})
    deleteUser(@Param('uniqueId') uniqueId, @Body() updateUser: AzureDtoUser){
    
      return this.adminService.deleteUser(uniqueId, updateUser);
    }

    // Admin products and pricing api

    @Post("/product")
    createStripeProduct(@Body() createProduct:CreateProductDto ){
    
      return this.adminService.createStripeProduct(createProduct);
    }

    @Get("/products")
    getallProducts(){
    
      return this.adminService.getAllProducts();
    }

    @Post("/price")
    createStripePrice(@Body() createPrice: CreatePriceDto){
    
      return this.adminService.createStripePrice(createPrice);
    }

    @Get("/price")
    GetAllStripePrices(){
    
      return this.adminService.getAllPrices();
    }

    // This api internally calls the stripe 
    // And creates the subscription for the user and also makes the entry
    // in the userSubscription Table
    //When creating a subscription in Stripe, the product
    // ID is not directly used. Instead, the Price ID is used. 
    //The Price object is linked to a product when it is created.
    @Post("/createLicense")
    AssignSubscriptionLicenseToTheUser(@Body() subscriptionLicense: SubscriptionLicenseDto){
    
      return this.adminService.createSubscriptionLicense(subscriptionLicense);
    }
  
  
  
  }
  