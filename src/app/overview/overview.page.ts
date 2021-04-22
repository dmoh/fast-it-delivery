import { Component, OnInit } from '@angular/core';
import {DeliveryService} from "@app/_services/delivery.service";
import {Router} from "@angular/router";
import {UserService} from "@app/_services/user.service";
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  amountOrderCurrentMonth :number;
  countOrderCurrentMonth :number;
  statusDeliverer :boolean;
  rangeDate: any;
  fastOff = environment.fastOff;
  fastOn = environment.fastOnline;

  constructor(private  deliveryService: DeliveryService, private userService: UserService,
              private router: Router, private authenticate: AuthenticationService) { }

  ngOnInit() {
    this.statusDeliverer = localStorage.getItem("statusDeliverer") == "true";
    this.rangeDate = {dtstart : new Date().toLocaleDateString(), dtend : new Date().toLocaleDateString()};

    // setTimeout(() => {
    const getOrderSub = this.deliveryService.getOrderAnalize(1, this.rangeDate)
        .subscribe((response) => {
          console.log(response);
          this.amountOrderCurrentMonth = ((response.delivery_cost).toFixed(2)).replace('.', ',');
          this.countOrderCurrentMonth = response.count;
          setTimeout(() => {
          }, 0);
        });
        
    //   getOrderSub.unsubscribe();
    // }, 1000);
  }

  goTo(page:string):void{
    switch (page) {
      case 'order-online':
        this.router.navigate(['pending-orders'])
        break;
      case 'order-avalaible':
        this.router.navigate(['available-orders'])
        break;
    }
  }

  onChangeStatus(){
    console.log(this.statusDeliverer);
    this.userService.setDelivererStatus(this.statusDeliverer)
        .subscribe((response) => {
          if (response.ok) {
            console.log('ok en ligne');
            localStorage.setItem('statusDeliverer', this.statusDeliverer ? "true" : "false");
            console.log('getitem',localStorage.getItem("statusDeliverer"));
            if ( this.statusDeliverer) {
              this.goTo('order-avalaible');
            }
          }
        });
  }

  onLogout() {
    this.authenticate.logout();
  }
}
