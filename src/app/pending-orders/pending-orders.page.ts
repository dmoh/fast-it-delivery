import { Component, OnDestroy, OnInit } from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '@app/_services/authentication.service';
import {DeliveryService} from '@app/_services/delivery.service';
import {Restaurant} from '@app/_models/restaurant';
import {Order} from '@app/_models/order';
import {Deliverer} from '@app/_models/deliverer';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.page.html',
  styleUrls: ['./pending-orders.page.scss'],
})
export class PendingOrdersPage implements OnInit, OnDestroy {

  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Deliverer;
  orders: any[] = [];
  order: Order;
  orderId: string;
  error: string;

  timerSubscription: Subscription;
  second: number;

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private authenticate: AuthenticationService, private deliveryService: DeliveryService, private router: Router) {
  }


  ngOnInit(){
    this.deliverer = new Deliverer();
    this.deliverer.orders = [];

    this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {
      console.log(delivererCurrent);
      // get Orders awaiting delivery
      this.deliverer = delivererCurrent;
      this.orders = this.deliverer?.orders ?? new Array();
      // this.orders = this.orders.sort( (a,b) => b-a);
      // this.orders = this.orders.filter(x => x == 0);
      console.log("order", this.orders);
    });

    const source = timer(4000, 7000);
    this.timerSubscription = source.subscribe(val => {
      this.second = val;
      this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {
        console.log(delivererCurrent);
        this.deliverer = delivererCurrent;
        this.orders = this.deliverer?.orders ?? new Array();
      });
    });
    setTimeout(() => {
      this.timerSubscription.unsubscribe();
    }, 1000000);

  }

  onLogout() {
    this.authenticate.logout();
  }

  onSubmit(orderId: string) {
    console.log('orderId', orderId);
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     orderId
    //   }
    // };
    // console.log('navigationExtras', navigationExtras);
    // @ts-ignore
    // this.router.navigate(['detail-delivery'], navigationExtras);
    this.router.navigate([`/detail-delivery/${orderId}`]);
  }  
  
  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
