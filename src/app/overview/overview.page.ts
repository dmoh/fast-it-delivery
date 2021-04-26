import { Component, OnInit } from '@angular/core';
import {DeliveryService} from "@app/_services/delivery.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  // imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  imgLogo: string = "/assets/fast_it.png";
  amountOrderCurrentMonth :number;
  countOrderCurrentMonth :number;
  // statusDeliverer :boolean;
  rangeDate: any;
  fastOff = environment.fastOff;
  fastOn = environment.fastOnline;

  _statusDeliverer :boolean = false;

  get userInfo(): Deliverer {
    return <Deliverer> JSON.parse( localStorage.getItem("userInfo") ) ?? null;
  }

  get statusDeliverer() {
    // return localStorage.getItem("statusDeliverer") == "true";
    return this._statusDeliverer;
  }

  set statusDeliverer(statusDelivery) {
    this._statusDeliverer = statusDelivery;
  }

  get listSector(): any {
    let listSector = new Array<any>();
    this.userInfo?.sectors?.forEach( sector => {
      const urlSector = `/sector/${sector.id}/${(<string>sector.name).trim().replace(' ','')}`;
      listSector.push({
        text: `Commandes ${sector.name}`,
        role: `Commandes ${sector.name}`,
        handler:() => this.router.navigate([urlSector])
      })
    }) 
    console.log("listSector",listSector);

    return listSector;
  }

  constructor(private  deliveryService: DeliveryService, private userService: UserService,
              private router: Router, private authenticate: AuthenticationService,
              private activatedRout: ActivatedRoute,
              private actionsService: ActionsService) { 
      this.activatedRout.queryParams.subscribe(params => {
        console.log(params);
      // if (params != null) {
      //   params = null;
      //   this.router.navigate(["overview"]);
      // };
    });
  }

  ngOnInit() {
    this.statusDeliverer = localStorage.getItem("statusDeliverer") == "true";
    this.rangeDate = {dtstart : new Date().toLocaleDateString(), dtend : new Date().toLocaleDateString()};

    if (!this.userInfo) {
      this.userService.getDeliverer("").subscribe( deliverer => {
       localStorage.setItem("userInfo", JSON.stringify(deliverer));
     });
    }
    // setTimeout(() => {
    const getOrderSub = this.deliveryService.getOrderAnalize(1, this.rangeDate)
        .subscribe((response) => {
          console.log(response);
          this.amountOrderCurrentMonth = ((response.delivery_cost).toFixed(2)).replace('.', ',');
          this.countOrderCurrentMonth = response.count;
          this.userInfo;
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
        this.actionsService.presentActionSheet("Commandes disponibles", this.listSector);
        // this.router.navigate(['available-orders'])
        break;
      case 'order-delivered':
        this.router.navigate(['delivered-orders'])
        break;
    }
  }

  async onChangeStatus(){
    console.log("onChangeStatus", this.statusDeliverer);
    this.userService.setDelivererStatus(this.statusDeliverer)
        .subscribe(async (response) => {
          if (response.ok) {
            // pr eviter de retoutner sur la vue si status n'as pas changé
            const deliverer = await this.userService.getDeliverer("").toPromise();
            // .then( deliverer => {
              localStorage.setItem("userInfo", JSON.stringify(deliverer));
            // });

            const oldStatus = localStorage.getItem("statusDeliverer") == "true";
            localStorage.setItem('statusDeliverer', this.statusDeliverer ? "true" : "false");
            if ( this.statusDeliverer && this.statusDeliverer != oldStatus) {
              this.actionsService.presentToastWithOptions("","eye",`Vous êtes en mode ${this.fastOn}`,"top","",null,1000);
              this.goTo('order-avalaible');
            } else {
              if (this.statusDeliverer != oldStatus){}
                this.actionsService.presentToastWithOptions("","eye-off-outline",`Vous êtes en mode ${this.fastOff}`,"top","",null,1000);
            }
          }
        }, err => {
          console.log("err", err);
          this.actionsService.presentToastWithOptions("","alert-circle-outline", `${err.name} : status ${err.statusText}`, "top", "",null,5000)
          this.actionsService.presentToastWithOptions("","alert-circle-outline", `Probleme de connexion, veuillez vous reconnecter!`, "top", "",null)
        });
  }

  onLogout() {
    this.authenticate.logout();
  }
}
