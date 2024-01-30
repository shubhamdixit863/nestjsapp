import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"
import { ProductDto } from "./Product.dto"

export class ChargeRequest{
@IsNotEmpty()
@ApiProperty({ isArray: true,  type: ProductDto })

   products:ProductDto[]

@IsNotEmpty()
 
@ApiProperty()
currency:string

}