import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entity/UserEntity';
import * as moment from 'moment';

export class UserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  tax_no: string;

  
  @IsString()
  @ApiProperty()
  displayName: string;
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  firstName: string;


  @IsString()
  @ApiProperty()
  givenName: string;

  @IsString()
  @ApiProperty()
  companyName:string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  step: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  signInType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  objectId: string;

  @IsString()
  @ApiProperty()
  avtarUrl: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  country: string;

  @IsString()
  @ApiProperty()
  areaCode: string;
  @IsString()
  @ApiProperty()
  clientId: string;

  static toEntity(userDto: UserDto): UserEntity {
    const user = new UserEntity();
    user.email = userDto.email || '';
    user.city = userDto.city || '';
    user.phone = userDto.phone || '';
    user.tax_no = userDto.tax_no || '';
    user.name = userDto.displayName || '';
    user.uniqueId = userDto.objectId || '';
    user.avtarUrl = userDto.avtarUrl || '';
    user.country = userDto.country || '';
    user.areaCode = userDto.areaCode || '';
    user.companyName=userDto.companyName || '';
    user.city = userDto.city || '';
    user.isActive = true; // Default to true if isActive is not provided
    user.signInType=userDto.signInType
    user.clientId=userDto.clientId;
    return user;
  }
}


export class UserEditDto {
  

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  tax_no: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  displayName: string;

  @IsString()
  @ApiProperty()
  companyName:string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  step: string;

  @IsString()
  @ApiProperty()
  city: string;




  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  country: string;

  @IsString()
  @ApiProperty()
  areaCode: string;

  static toEntity(userDto: UserEditDto): UserEntity {
    const user = new UserEntity();
    user.city = userDto.city || '';
    user.phone = userDto.phone || '';
    user.tax_no = userDto.tax_no || '';
    user.name = userDto.displayName || '';
    user.country = userDto.country || '';
    user.areaCode = userDto.areaCode || '';
    user.city = userDto.city || '';
    user.companyName=userDto.companyName || '';
    user.updatedAt=moment().toDate();
    user.isActive = true; // Default to true if isActive is not provided
    return user;
  }
}