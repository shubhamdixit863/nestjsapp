import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { UserEntity } from "../entity/UserEntity";
import *as moment from "moment";


export class AzureDtoUser {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNumber()
  roleId:number

  static toEntity(userDto: AzureDtoUser,id:string): UserEntity {
    const user = new UserEntity();
    user.city = userDto.city || '';
    user.email=userDto.email || '';
    user.uniqueId=id;
    user.phone = userDto.phone || '';
    user.tax_no =  '';
    user.name = userDto.name || '';
    user.country = userDto.country || '';
    user.avtarUrl="";
    user.areaCode =  '';
    user.city = userDto.city || '';
    user.companyName= '';
    user.updatedAt=moment().toDate();
    user.isActive = true; // Default to true if isActive is not provided
    return user;
  }
}


class PasswordProfile {
  password?: string = "6c21786a-c7dc-0cf0-b1da-ae89102aa114";
  forceChangePasswordNextSignIn: boolean = false;
}

class Identity {
  signInType: string = "emailAddress";
  issuer: string = "trueworldorganization.onmicrosoft.com";
  issuerAssignedId: string;
}

export class CreateUserDto {
  constructor(azureUser: AzureDtoUser,id:string) {
    this.accountEnabled = true;
    this.mailNickname = 'default';
    this.officeLocation = 'default';
    this.postalCode = 'default';
   // this.preferredLanguage = 'default';
    this.userPrincipalName = `${id}@trueworldorganization.onmicrosoft.com`;
   // this.usageLocation = 'default';
    this.city = azureUser.city;
    this.country = azureUser.country;
    this.displayName = azureUser.name;
    this.passwordPolicies = 'DisablePasswordExpiration';
    this.passwordProfile = new PasswordProfile();
    this.identities = [new Identity()];
    this.identities[0].issuerAssignedId = azureUser.email;
    this.mobilePhone = azureUser.phone;
    this.state = 'default';
    this.streetAddress = 'default';
    this.surname = 'default';
  }

  accountEnabled: boolean;
  mailNickname: string;
  officeLocation: string;
  postalCode: string;
  preferredLanguage: string;
  userPrincipalName: string;
  usageLocation: string;
  mobilePhone: string;
  city: string;
  country: string;
  displayName: string;
  passwordPolicies: string;
  passwordProfile: PasswordProfile;
  identities?: Identity[];
  state: string;
  streetAddress: string;
  surname: string;
}
