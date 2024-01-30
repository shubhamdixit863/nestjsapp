export class RoleEntity {
  name: string;
  id: number;
  description: string;
  permission:string;

    public getName(): string {
      return this.name;
    }
  
    public getDescription(): string {
      return this.description;
    }
  
 
   
    public setId(id: number): void {
      this.id =id;
    }
  
   
    public setName(name: string): void {
      this.name = name;
    }
  
    public setDescription(description: string): void {
      this.description = description;
    }

    public setPermission(permission: string): void {
      this.permission = permission;
    }


  
}