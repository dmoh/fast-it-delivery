import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '@app/_services/authentication.service';
import {DeliveryService} from '@app/_services/delivery.service';
import {Restaurant} from '@app/_models/restaurant';
import {Order} from '@app/_models/order';
import {Deliverer} from '@app/_models/deliverer';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.page.html',
  styleUrls: ['./pending-orders.page.scss'],
})
export class PendingOrdersPage implements OnInit {

  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Deliverer;
  orders: any[] = [];
  order: Order;
  orderId: string;
  error: string;
  headers: any;

  userNameNoLimit = 'fasteat74@gmail.com';
  nbDeliveryMax = 1;

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private authenticate: AuthenticationService, private deliveryService: DeliveryService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat')) {
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
   }


ngOnInit(){

  this.deliverer = new Deliverer();
  this.deliverer.orders = [];

  this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {

    console.log(delivererCurrent);
      // get Orders awaiting delivery
    this.deliverer = delivererCurrent;
    this.orders = (this.deliverer.orders != null) ? this.deliverer.orders : new Array();
    
    console.log("order", this.orders);
  });


}
  onSubmit(orderId: string) {
    console.log('orderId', orderId);
    let navigationExtras: NavigationExtras = {
      state: {
        orderId
      }
    };
    console.log('navigationExtras', navigationExtras);
    // @ts-ignore
    this.router.navigate(['detail-delivery'], navigationExtras);

  }
}
