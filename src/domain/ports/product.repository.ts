import { ProductEntity } from "../entity/ProductEntity";
import { UserEntity } from "../entity/UserEntity";

export interface ProductRepository {
    createProduct(productEntity:ProductEntity):Promise<any>
    updateProduct(productEntity:ProductEntity):Promise<any>

    getProductById(Id:number):Promise<any>
    getProductByStripeProductId(stripeProductId:string):Promise<any>
    getAllProducts():Promise<any>
    

   



}