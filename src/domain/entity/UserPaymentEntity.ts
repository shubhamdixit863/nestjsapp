export class UserPaymentEntity {
  id: never;
  uniqueId: string;
  sessionId: string;
  paymentStatus: string;
  productId: string;
  priceId: string;
  customerId: string;
  uniquePaymentId: string;
  amount: number;
  invoiceUrl: string; // Add the invoiceUrl property
  productMetaData:string;

  constructor(
    uniqueId: string,
    sessionId: string,
    paymentStatus: string,
    productId: string,
    priceId: string,
    customerId: string,
    uniquePaymentId: string,
    amount: number,
    invoiceUrl: string, // Add the invoiceUrl constructor parameter
    productMetaData:string,
  ) {
    this.uniqueId = uniqueId;
    this.sessionId = sessionId;
    this.paymentStatus = paymentStatus;
    this.productId = productId;
    this.priceId = priceId;
    this.customerId = customerId;
    this.amount = amount;
    this.uniquePaymentId = uniquePaymentId;
    this.invoiceUrl = invoiceUrl; // Initialize the invoiceUrl property
    this.productMetaData=productMetaData;
  }

  static builder(uniqueId: string): UserPaymentEntityBuilder {
    return new UserPaymentEntityBuilder(uniqueId);
  }
}

export class UserPaymentEntityBuilder {
  private uniqueId: string;
  private sessionId?: string;
  private paymentStatus?: string;
  private productId?: string;
  private priceId?: string;
  private customerId?: string;
  private amount?: number;
  private uniquePaymentId?: string;
  private invoiceUrl?: string; // Add the invoiceUrl property
  private productMetaData?:string

  constructor(uniqueId: string) {
    this.uniqueId = uniqueId;
  }

  withSessionId(sessionId: string): UserPaymentEntityBuilder {
    this.sessionId = sessionId;
    return this;
  }

  withUniquePaymentId(uniquePaymentId: string): UserPaymentEntityBuilder {
    this.uniquePaymentId = uniquePaymentId;
    return this;
  }

  withUniqueProductMetaData(productMetaData: string): UserPaymentEntityBuilder {
    this.productMetaData = productMetaData;
    return this;
  }
  

  withPaymentStatus(paymentStatus: string): UserPaymentEntityBuilder {
    this.paymentStatus = paymentStatus;
    return this;
  }

  withProductId(productId: string): UserPaymentEntityBuilder {
    this.productId = productId;
    return this;
  }

  withPriceId(priceId: string): UserPaymentEntityBuilder {
    this.priceId = priceId;
    return this;
  }

  withCustomerId(customerId: string): UserPaymentEntityBuilder {
    this.customerId = customerId;
    return this;
  }

  withAmount(amount: number): UserPaymentEntityBuilder {
    this.amount = amount;
    return this;
  }

  withInvoiceUrl(invoiceUrl: string): UserPaymentEntityBuilder {
    this.invoiceUrl = invoiceUrl; // Add the withInvoiceUrl method
    return this;
  }

  build(): UserPaymentEntity {
    return new UserPaymentEntity(
      this.uniqueId,
      this.sessionId,
      this.paymentStatus,
      this.productId,
      this.priceId,
      this.customerId,
      this.uniquePaymentId,
      this.amount,
      this.invoiceUrl, // Include the invoiceUrl property in the build method
      this.productMetaData,
    );
  }
}
