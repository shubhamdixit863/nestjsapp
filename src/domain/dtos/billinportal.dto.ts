import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"
import { ProductDto } from "./Product.dto"

export class BillingPortalRequest{
@IsNotEmpty()
@ApiProperty()
userUniqueId:string

@IsNotEmpty()
 
@ApiProperty()
redirectUrl:string

}