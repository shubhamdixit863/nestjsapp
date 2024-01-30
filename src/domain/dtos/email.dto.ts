import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { configData } from 'src/config';

export class From {
  @ApiProperty({ default: configData.adminEmail })
  @IsEmail()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ default: configData.adminName })
  @IsNotEmpty()
  name: string;
}

export class TEmailDtoCustomer {
  @ApiProperty({ type: () => From })
  @IsEmail()
  @IsNotEmpty()
  from: From;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ default: configData.sg_customer_templateId })
  @IsNotEmpty()
  templateId: string=configData.sg_customer_templateId;

  constructor(to: string, from: From, subject: string, text: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
  }
}

// email dto for template email to two customer
export class EmailDtoCustomer {
  @ApiProperty({ default: 'info@trueworld.org' })
  @IsEmail()
  @IsNotEmpty()
  from: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ default: configData.sg_customer_templateId })
  @IsNotEmpty()
  templateId: string=configData.sg_two_templateId
  constructor(to: string, from: string, subject: string, text: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
  }
}


// email dto for template email to two admin
export class TEmailDtoTwo {
  @ApiProperty({ type: () => From })
  @IsEmail()
  @IsNotEmpty()
  from: From;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ default: configData.sg_two_templateId })
  @IsNotEmpty()
  templateId: string;

  constructor(to: string, from: From, subject: string, text: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
  }
}
