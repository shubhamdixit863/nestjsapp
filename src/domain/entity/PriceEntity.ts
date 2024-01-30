
export class Price {
    public id: number;
    public priceId: string;
    public currency: string;
    public planType: string;
    public features: string;
    public tenure: string;
    public description: string;
    public price: number;
    public createdAt: Date;
    public updatedAt: Date;
    public isActive: boolean;
    public stripeProductId: string;
    public productId: number;


    constructor(
      
        priceId: string, 
        currency: string, 
        tenure: string = "", 
        description: string, 
        price: number, 
      
        stripeProductId: string, 
        productId: number, 
        isActive:boolean,
        planType:string,
        features:string,

      
    ) {
  
        this.priceId = priceId;
        this.currency = currency;
        this.tenure = tenure;
        this.description = description;
        this.price = price;
      
        this.stripeProductId = stripeProductId;
        this.productId = productId;
        this.isActive=isActive;
        this.features=features;
        this.planType=planType;

    }
}
