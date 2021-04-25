import { Component, OnInit } from '@angular/core';
import {DeliveryService} from "@app/_services/delivery.service";
import {Router} from "@angular/router";
import {UserService} from "@app/_services/user.service";
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ActionsService } from '@app/_services/actions.service';
import { Deliverer } from '@app/_models/deliverer';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  amountOrderCurrentMonth :number;
  countOrderCurrentMonth :number;
  // statusDeliverer :boolean;
  rangeDate: any;
  fastOff = environment.fastOff;
  fastOn = environment.fastOnline;

  _statusDeliverer :boolean;

  get userInfo(): Deliverer {
    return <Deliverer> JSON.parse( localStorage.getItem("userInfo") );
  }

  get statusDeliverer() {
    // return localStorage.getItem("statusDeliverer") == "true";
    return this._statusDeliverer;
  }

  set statusDeliverer(statusDelivery) {
    this._statusDeliverer = statusDelivery;
  }

  get listSector(): any {
    return [
      {
        text: 'Destructive',
        role: 'destructive',
        handler: () => {
          console.log('Destructive clicked');
        }
      },{
        text: 'Archive',
        handler: () => {
          console.log('Archive clicked');
        }
      },{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ];
  }

  constructor(private  deliveryService: DeliveryService, private userService: UserService,
              private router: Router, private authenticate: AuthenticationService,
              private actionsService: ActionsService) { }

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
        this.actionsService.presentActionSheet("Commandes disponibles");
        // this.router.navigate(['available-orders'])
        break;
      case 'order-delivered':
        this.router.navigate(['delivered-orders'])
        break;
    }
  }

  onChangeStatus(){
    console.log("onChangeStatus", this.statusDeliverer);
    this.userService.setDelivererStatus(this.statusDeliverer)
        .subscribe((response) => {
          if (response.ok) {
            // pr eviter de retoutner sur la vue si status n'as pas changé
            const oldStatus = localStorage.getItem("statusDeliverer") == "true";

            console.log('ok en ligne');
            console.log('getitem',localStorage.getItem("statusDeliverer"));
            localStorage.setItem('statusDeliverer', this.statusDeliverer ? "true" : "false");
            console.log('getitem',localStorage.getItem("statusDeliverer"));
            if ( this.statusDeliverer && this.statusDeliverer != oldStatus) {
              this.authenticate.presentToastWithOptions("","eye",`Vous êtes en mode ${this.fastOn}`);
              this.goTo('order-avalaible');
            } else {
              if (this.statusDeliverer != oldStatus)
                this.authenticate.presentToastWithOptions("","eye-off-outline",`Vous êtes en mode ${this.fastOff}`);
            }
          }
        });
  }

  onLogout() {
    this.authenticate.logout();
  }
}
