import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.page.html',
  styleUrls: ['./pending-orders.page.scss'],
})
export class PendingOrdersPage implements OnInit {


  public orders: Array<{ restaurant: string; order: number ; dateTake: string; preparingTime: string, delivery_cost: number, tip: number, fastItBonus: number}> = [];
  constructor(private router: Router) {
    for (let i = 1; i < 3; i++) {
    this.orders.push({
      restaurant: 'Panama',
      order: i,
      dateTake: '02-01-2021 13:56:00',
      preparingTime: '(15-30 min)',
      delivery_cost: 3.5,
      tip: 0.5,
      fastItBonus: 0


    });
  }
}


ngOnInit(){


}
  onSubmit() {

    this.router.navigate(['detail-delivery'])

  }
}
