import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { RoleEntity } from '../entity/RoleEntity';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({default:"comma , separated, permissions"})
  @IsNotEmpty()
  @IsString()
  permission: string;

  static toEntity(dto: CreateRoleDto): RoleEntity {
    const { name, description,permission } = dto;
    const role = new RoleEntity();
    
    role.setName(name);
    role.setDescription(description);
    role.setPermission(permission);
   

    return role;
  }
}
