import {User} from '@app/_models/user';
import {Cart} from '@app/_models/cart';
import {Restaurant} from "@app/_models/restaurant";
import { Deliverer } from './deliverer';

export class Order {
  amount: number = 0;
  readonly id: number;
  customer: User;
  business: Restaurant = new Restaurant();
  address: string = null;
  addressToDeliver: string = null;
  date: string = null;
  deliverCode: string = null;
  deliverer: Deliverer = new Deliverer();
  payedAt: string = null;
  orderAcceptedByMerchant?: boolean;
  idReference?: string = null; // AAAAMMNUMID EXemple: 20200800000001
  cartDetail: Cart;
  status: number;
  comment: string;
  // tslint:disable-next-line:variable-name
  delivery_cost: number;
  date_delivered: any;
}

