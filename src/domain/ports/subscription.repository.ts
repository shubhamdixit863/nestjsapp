import Subscription from "../entity/SubscriptionEntity";
import { UserEntity } from "../entity/UserEntity";

export interface SubscriptionRepository {
    createSubscription(subscription:Subscription):Promise<any>
    getSubscriptionByUserUniqueId(Id:string):Promise<any>
    getSubscriptionBySubscriptionId(subscriptionId:string):Promise<any>

    updateSubscriptionByUniqueId(userUnqiueId:string,price:string)
    updateSubscriptionBySubscriptionId(userUnqiueId:string,price:string)

    updateSubscriptionStatusByUniqueId(userUnqiueId:string,status:string)

    deleteSubscriptionByUserUniqueId(Id:string,subId:string):Promise<any>


   



}