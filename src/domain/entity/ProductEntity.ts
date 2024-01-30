
export class ProductEntity {

  constructor(
    productId: string,
    productImage: string,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    name:string,
    description:string,
  

  ) {
    this.productId = productId;
    this.productImage = productImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.name=name;
    this.description=description;

    
  }
  id?: never;
  productId!: string;
  productImage: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  name:string;
  description:string;




}
