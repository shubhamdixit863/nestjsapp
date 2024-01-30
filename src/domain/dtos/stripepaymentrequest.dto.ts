import { Product } from './Productinterface';

export interface StripePaymentRequestBody {
  products: Product[];
  currency: string;
}