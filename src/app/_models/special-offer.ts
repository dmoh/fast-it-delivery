    import {Restaurant} from '@app/_models/restaurant';

export class SpecialOffer {
  id: number = 0;
  restaurantId: number;
  promotionalCode: string = '';
  title: string = '';
  isActive: boolean = true;
  specialOfferAmount: number = 0;
  minimumAmountForOffer: number = 0;
  createdAt: {} = {};
  dateBegin: {} = {};
  dateEnd: {} = {};
}

