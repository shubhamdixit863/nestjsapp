import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SubscriptionLicenseDto {


   
    @ApiProperty()
    @IsNotEmpty()

    userUniqueId: string;
    @ApiProperty()
    @IsNotEmpty()

    stripePriceId: string;


 
  
  }