import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"
import { ProductDto } from "./Product.dto"

export class CreateCheckoutSession{


@IsNotEmpty()
 @ApiProperty()
url:string

@IsNotEmpty()
 @ApiProperty()
quantity:number

@IsNotEmpty()
 @ApiProperty()
priceId:string


@IsNotEmpty()
 @ApiProperty()
productId:string

@IsNotEmpty()
 @ApiProperty()
uniqueId:string



}


export class CheckoutSessionQuery{



    @IsNotEmpty()
     @ApiProperty()
    sessionId:string
    
    
    
    }