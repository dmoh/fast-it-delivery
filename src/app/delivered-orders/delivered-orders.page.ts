import { Component, OnInit } from '@angular/core';
import { Deliverer } from '@app/_models/deliverer';
import { Order } from '@app/_models/order';
import { DeliveryService } from '@app/_services/delivery.service';

@Component({
  selector: 'app-delivered-orders',
  templateUrl: './delivered-orders.page.html',
  styleUrls: ['./delivered-orders.page.scss'],
})
export class DeliveredOrdersPage implements OnInit {

  deliverer: Deliverer;
  orders: Array<Order>;

  constructor(private deliveryService: DeliveryService) { }

  ngOnInit() {
    this.deliverer = new Deliverer();
    this.deliveryService.getInfosDeliverer().subscribe((delivererInfo) => {
      this.deliverer = delivererInfo;
      console.info("Livraisons effectuées", this.deliverer);
      if (this.deliverer) {
        if (this.deliverer.orders) {
          // ajouter param dans le back end pour filtrer les commandes livré
          this.deliverer.orders = this.deliverer.orders.filter( order => order.date_delivered != null );
          this.deliverer.orders = this.deliverer.orders.sort( function(a, b) {
            return b.id - a.id;
          }) ;
          this.orders = this.deliverer.orders;
        }
      }
    });
  }

}
