import { UserEntity } from "../entity/UserEntity";

export interface UserRepository {
    /// this creates a user and it to the organisation as well
    createUser(user: UserEntity, roleId: number):Promise<any>
    getUserByUniqueId(uniqueId:string):Promise<any>
    updateUserByUniqueId(uniqueId:string,user: UserEntity):Promise<any>
    updateProfilePic(uniqueId: string,avtarUrl:string): Promise<any>
    updateStripeCustomerId(uniqueId: string,stripeCustomerId:string): Promise<any>
    updateUserRole(id: string, roleId: number): Promise<any>
    getUsersPaginated(page:number,limit:number,search:string):Promise<any>
   



}