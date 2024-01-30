import { Price } from "../entity/PriceEntity";

export interface PriceRepository {
  create(price: Price): Promise<Price>;
  findById(id: number): Promise<Price | null>;
  findAll(): Promise<Price[]>;
  updateById(id: number, price: Price): Promise<void>;
  deleteById(id: number): Promise<void>;
}
