import { ApiProperty } from "@nestjs/swagger";


export class CodeDto {
  @ApiProperty()

  code: string;
}


export class RefereshTokenDto {
  @ApiProperty()

  refreshToken: string;
}
