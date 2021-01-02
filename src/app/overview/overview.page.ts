import { Component, OnInit } from '@angular/core';
import {DeliveryService} from "@app/_services/delivery.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  amountOrderCurrentMonth :number;
  countOrderCurrentMonth :number;
  constructor(private  deliveryService: DeliveryService) { }

  ngOnInit() {
    this.deliveryService.getOrderAnalize(1)
        .subscribe((response) => {
          console.log(response);
          this.amountOrderCurrentMonth = ((response.delivery_cost).toFixed(2)).replace('.', ',');
          this.countOrderCurrentMonth = response.count;
        });
  }

  goTo(page:string):void{
    switch (page) {
      case 'order-online':

        break;
      case 'order-avalaible':
        break;

    }
  }


}
