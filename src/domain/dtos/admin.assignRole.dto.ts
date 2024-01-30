import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  roleId: number;
}
