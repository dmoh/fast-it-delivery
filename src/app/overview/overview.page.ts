import { Component, OnInit } from '@angular/core';
import {DeliveryService} from "@app/_services/delivery.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ActionsService } from '@app/_services/actions.service';
import { Deliverer } from '@app/_models/deliverer';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';

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
    return this.delivererService.currentUser ?? null;
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

  constructor(
    private activatedRout: ActivatedRoute,
    private platform: Platform,
    private authenticate: AuthenticationService,
    private delivererService: DeliveryService,
    private router: Router,
    private firebase: FirebaseX,
    private actionsService: ActionsService) { 

  }

  initializeApp() {
    this.platform.ready().then( async () => {

      const tokenFcm = await this.firebase.getToken();
      console.log(`The token async is`, tokenFcm);
      
      if (this.platform.is('ios')) {
        this.firebase.grantPermission().then(hasPermission => console.log(hasPermission ? 'granted' : 'denied'));
        this.firebase.onApnsTokenReceived().subscribe(token => {
          this.delivererService.setTokenFcm(token, 'ios').subscribe();
          console.log('PUSH_TOKEN: IOS_TOKEN: ' , token);
        });
      }
    
      this.firebase.onTokenRefresh().subscribe(
        token => {
          this.delivererService.setTokenFcm(token).subscribe();
          console.log(`FCM token refresh: ${token}`);
        },
        error => console.log("error", error)
      );
      
      this.firebase.onMessageReceived().subscribe(
        data => {
          this.actionsService.presentToast("Reception d'une notification");
          console.log(`FCM message:`, data);
        },
        err => console.log("msg", err) 
      );

    });
  }

  ngOnInit() {
    // this.statusDeliverer = localStorage.getItem("statusDeliverer") == "true";
    this.statusDeliverer = this.delivererService.currentUser?.status ?? false;

    this.rangeDate = {dtstart : new Date().toLocaleDateString(), dtend : new Date().toLocaleDateString()};

    if (!this.userInfo) {
      this.delivererService.getDeliverer().subscribe( deliverer => {
      //  localStorage.setItem("userInfo", JSON.stringify(deliverer));
      // console.log("userInfo", this.userInfo);
      // console.log("deliverer", deliverer);
      // this.userInfo;
      this.statusDeliverer = this.userInfo?.status ?? false;
     });
    }
    // setTimeout(() => {
    const getOrderSub = this.delivererService.getOrderAnalize(1, this.rangeDate)
        .subscribe((response) => {
          console.log("analyze", response);
          this.amountOrderCurrentMonth = ((response.delivery_cost).toFixed(2)).replace('.', ',');
          this.countOrderCurrentMonth = response.count;
          // this.userInfo;
          setTimeout(() => {
          }, 0);
        });
        
    this.initializeApp();  
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
    this.delivererService.setDelivererStatus(this.statusDeliverer)
        .subscribe(async (response) => {
          if (response.ok) {
            this.delivererService.currentUser.status = this.statusDeliverer;
            // pr eviter de retoutner sur la vue si status n'as pas changé
            const deliverer : Deliverer = await this.delivererService.getDeliverer().toPromise();
            // .then( deliverer => {
              //  localStorage.setItem("userInfo", JSON.stringify(deliverer));
               console.log("currentUser", this.delivererService.currentUser, "deliverer" , deliverer);
            // });

            // const oldStatus = localStorage.getItem("statusDeliverer") == "true";
            // localStorage.setItem('statusDeliverer', this.statusDeliverer ? "true" : "false");
            // if ( this.statusDeliverer && this.statusDeliverer != oldStatus) {
            if ( this.statusDeliverer) {
              this.actionsService.presentToastWithOptions("","eye",`Vous êtes en mode ${this.fastOn}`,"top","",null,1000);
              this.goTo('order-avalaible');
            } else {
            //   if (this.statusDeliverer != oldStatus){}
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
