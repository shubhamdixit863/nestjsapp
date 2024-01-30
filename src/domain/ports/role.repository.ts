import { ProductEntity } from "../entity/ProductEntity";
import { RoleEntity } from "../entity/RoleEntity";
import { UserEntity } from "../entity/UserEntity";

export interface RoleRepository {
  createRole(roleEntity: RoleEntity) :Promise<any>;
  getRoles():Promise<RoleEntity[]>;
  getRoleById(id :number):Promise<RoleEntity>;
  getRoleByName(name :string):Promise<RoleEntity>;


}