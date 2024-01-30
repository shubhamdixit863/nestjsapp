 class Subscription {
    id: number;
    uniqueId: string;
    status: string;
    subscriptionId: string;
    productId: string;
    priceId: string;
    invoiceUrl: string;
    customerId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    productMetaData:string;
    subscriptionStartTime:number;
    subscriptionEndTime:number;
    paymentMethodsData:string;
  
    constructor(
      uniqueId: string,
      subscriptionId: string,
      productId: string = "",
      priceId: string = "",
      invoiceUrl: string = "",
      customerId: string = "",
      amount: number = 0,
      productMetaData:string="",
      subscriptionStartTime:number=0,
      subscriptionEndTime:number=0,
      paymentMethodsData:string=""
    ) {
      this.uniqueId = uniqueId;
      this.status = "active";
      this.subscriptionId = subscriptionId;
      this.productId = productId;
      this.priceId = priceId;
      this.invoiceUrl = invoiceUrl;
      this.customerId = customerId;
      this.amount = amount;
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.productMetaData=productMetaData;
      this.subscriptionStartTime=subscriptionStartTime;
      this.subscriptionEndTime=subscriptionEndTime;
      this.paymentMethodsData=paymentMethodsData;
    }
  }
  
  export default Subscription;
  