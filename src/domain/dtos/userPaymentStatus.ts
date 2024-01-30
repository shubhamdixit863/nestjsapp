import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entity/UserEntity';
import * as moment from 'moment';

export class UserPaymentStatusDto {

  @IsString()
  @ApiProperty()
  userUniqueId: string;

  @IsString()
  @ApiProperty()
  uniquePaymentId: string;




}

