import { UserPaymentEntity } from "../entity/UserPaymentEntity"

export interface UserPaymentRepository {
    /// this creates a user and it to the organisation as well
    createUserPayment(userPayment:UserPaymentEntity):Promise<any>
    updateUserPaymentUserCancelled(status:string,uniquePaymentId:string):Promise<any>

    updateUserPayment(status:string,uniquePaymentId:string,customerId:string,invoiceUrl:string,amount:number):Promise<any>
    getUserPaymentByUniqueId(uniqueId:string,uniquePaymentId:string):Promise<any>
    getAllUserPaymentsByUniqueId(uniqueId:string):Promise<any>
   }