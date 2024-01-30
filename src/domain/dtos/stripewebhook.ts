import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"
import { ProductDto } from "./Product.dto"

export class StripeWebhook{

 
@ApiProperty()
type:string

@ApiProperty()
data:any

}