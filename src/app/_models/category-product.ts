import {Product} from "@app/_models/product";

export class CategoryProduct {
  name: string = '';
  id: number = 0;
  business_id: number;
  businessId: number;
  products?: Product[] = [];
}
