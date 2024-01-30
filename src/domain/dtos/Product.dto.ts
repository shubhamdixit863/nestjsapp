import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
// Used For Stripe Web hook 
export class ProductDto {
    @ApiProperty()

    id: string;
    @ApiProperty()

    title: string;
    @ApiProperty()

    price: number;
    @ApiProperty()

    quantity: number;
  
  
  }


  // Price Dto for creating stripe prices on the admin
  export class PriceDto {
    @ApiProperty()

    id: string;
    @ApiProperty()

    title: string;
    @ApiProperty()

    price: number;
    @ApiProperty()

    quantity: number;
  
  
  }