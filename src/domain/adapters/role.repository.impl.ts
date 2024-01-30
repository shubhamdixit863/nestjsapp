import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entity/RoleEntity";
import { RoleRepository } from "../ports/role.repository";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(private prisma: PrismaService) {}

  async getRoleByName(name: string): Promise<RoleEntity> {
    try {
      const data = await this.prisma.role.findFirst({
        where: { name }
      });

      let re = new RoleEntity();
      re.setDescription(data.description);
      re.setPermission(data.permission);
      re.setId(data.id);
      re.setName(data.name);

      return re;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRoleById(id: number): Promise<RoleEntity> {
    try {
      const data = await this.prisma.role.findFirst({
        where: { id }
      });

      let re = new RoleEntity();
      re.setDescription(data.description);
      re.setPermission(data.permission);
      re.setId(data.id);
      re.setName(data.name);

      return re;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createRole(roleEntity: RoleEntity): Promise<any> {
    try {
      return await this.prisma.role.create({
        data: roleEntity
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRoles(): Promise<RoleEntity[]> {
    try {
      const roles = await this.prisma.role.findMany({});
      let roleEntity: RoleEntity[] = [];
      
      roles.forEach(ele => {
        const re = new RoleEntity();
        re.setName(ele.name);
        re.setDescription(ele.description);
        re.setId(ele.id);
        re.setPermission(ele.permission);

        roleEntity.push(re);
      });

      return roleEntity;
    } catch (error) {
      throw new Error(error);
    }
  }
}
