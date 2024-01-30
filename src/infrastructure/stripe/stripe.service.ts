import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripePaymentRequestBody } from 'src/domain/dtos/stripepaymentrequest.dto';
import { configData } from 'src/config';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(configData.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  createPayment(paymentRequestBody: StripePaymentRequestBody): Promise<any> {
    try {
      let sumAmount = 0;
      paymentRequestBody.products.forEach((product) => {
        sumAmount = sumAmount + product.price * product.quantity;
      });
      return this.stripe.paymentIntents.create({
        amount: sumAmount * 100,
        currency: paymentRequestBody.currency,
      });
      
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  
  }
  async getPrices(priceId: string): Promise<any> {
  try {
    const price = await this.stripe.prices.retrieve(priceId);
    return price;
    
  } catch (error) {
    console.log(error);
    throw new Error(error.toString());
  }
   
  }
  async getCheckoutSession(sessionId: string): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }

  }



  // create product ,this creates a product in stripe

  async createProduct(name: string, description: string, images: string[]) {
    try {
      const product = this.stripe.products.create({
        name: name,
        description: description,
        images: images,
      });
  
      return product;
      
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  
  }

  // get payment indtents stripe
  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );
      return paymentIntent;
      
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }

  }

  async getSubscription(subscriptionId: string) {
    try {
      const paymentIntent = await this.stripe.subscriptions.retrieve(
        subscriptionId,
      );
      return paymentIntent;
      
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  
  }

  // create a price too for the product

  async createPrice(
    unit_amount: number,
    currency: string,
    productId: string,
    interval: string,
  ) {
    try {
      const price = this.stripe.prices.create({
        unit_amount: unit_amount,
        currency: currency,
        recurring: { interval: interval },
        product: productId,
      });
  
      return price;
      
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  
  }

  // Cancel stripe subscription
  async cancelSubscription(subscriptionId: string) {
    try {
      return await this.stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
   
  }

  // This updates the subscription ,upgrade or downgrade the subscription
  // All we need to do is pass the subscriptionId and priceId
  // Rest stripe will try to make the payment instantly

  async updateSubscription(subscriptionId: string, priceId: string) {
    try {
      // Get subscription
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId,
      );

      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',

        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
      });
    } catch (error) {
      console.log(error);
      throw new Error(error.toString());
    }
  }

  // Retrieve customer card details stripe

  async getCardDetails(customerId: string, type: string) {
    try {
      const customer = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: type,
      });
  
      return customer;
      
    } catch (error) {

      console.error(error);
      throw new Error(error.toString());
      
    }
  
  }

  async createCheckoutSession(
    price: string,
    quantity: number,
    domainURL: string,
    client_reference_id: string,
    userUniqueId: string,
    productMetaData: string,
    customerId: string,
  ) {

    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        metadata: {
          payment_id: client_reference_id,
          userUniqueId,
          productMetaData, // Product Meta data is just the whole db dump of product
        },
        subscription_data: {
          metadata: {
            payment_id: client_reference_id,
            userUniqueId, // Passing userUnqiueId from azure signup as well into the payment data
            productMetaData,
          },
        },
        // A unique id generated in our system to identify the unqiue payment
        line_items: [
          {
            price: price,
            quantity: quantity,
          },
        ],
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        success_url: `${domainURL}/availableTools?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/cancelled`,
      });
      return session;
      
    } catch (error) {
      console.error(error);
      throw new Error(error.toString());
      
    }
   
  }

  // Create customer stripe

  async CreateCustomer(email: string, name: string) {

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
      
    } catch (error) {
      console.error(error);
      throw new Error(error.toString());
      
    }
   
  }

  async CreateBillingPortalLink(customerId: string, returnUrl: string) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
  
      return session.url;
      
    } catch (error) {
      console.error(error);
      throw new Error(error.toString());
      
    }
    
  }

  // This creates subscription for the user indirectly without user Intervention

  async CreateIndirectLicenseSubscription(
    customerId: string,
    priceId: string,
    userUniqueId: string,
  ) {

    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: userUniqueId,
      });
  
      return subscription;
      
    } catch (error) {
      console.error(error);
      throw new Error(error.toString());
      
    }
   
  }
}
