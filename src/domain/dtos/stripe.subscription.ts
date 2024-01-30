import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"
import { ProductDto } from "./Product.dto"

export class StripeSubscription{
@IsNotEmpty()
@ApiProperty()

   userUniqueId:string

@IsNotEmpty()
 
@ApiProperty()
subscriptionId:string

}

export class StripeUpdateSubscription{
   @IsNotEmpty()
   @ApiProperty()
   userUniqueId:string
   @IsNotEmpty()
   @ApiProperty()
   subscriptionId:string

   @IsNotEmpty()
   @ApiProperty()
   priceId:string
   
   }