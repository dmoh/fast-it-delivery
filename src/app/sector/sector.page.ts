import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deliverer } from '@app/_models/deliverer';
import { Order } from '@app/_models/order';
import { AuthenticationService } from '@app/_services/authentication.service';
import { DeliveryService } from '@app/_services/delivery.service';
import { environment } from '@environments/environment';
import { AlertController } from '@ionic/angular';
import * as fasteatconst from '@app/_util/fasteat-constants';
import { Subscription, timer } from 'rxjs';
import { ActionsService } from '@app/_services/actions.service';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.page.html',
  styleUrls: ['./sector.page.scss'],
})
export class SectorPage implements OnInit, OnDestroy {
  public sector: string;
  public idSector: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  deliverer: Deliverer;
  orders: any[] = [];
  order: Order;
  orderCurrentId: number;
  awaitingDelivery: any;
  error: string;
  headers: any;
  fastEatConst = fasteatconst;
  statusDeliverer: boolean=false;

  timerSubscription: Subscription;
  second: number;

  userNameNoLimit = 'fasteat74@gmail.com';
  // userNameNoLimit = 'test@gmail.com';

  nbDeliveryMax = 1;

  lastUpdate = new Promise((resolve, reject) => {
    const date = new Date();
    setTimeout(
        () => {
          resolve(date);
        }, 2000
    );
  });

  fastOff = environment.fastOff;
  fastOn = environment.fastOnline;

/**
 * @description userName recuperé dans le localstorage "stocké a la connexion"
 */
    public get userName () {
    // console.log("userName",localStorage.getItem('username'));
    return localStorage.getItem('username') ?? "";
  }

  // tslint:disable-next-line:max-line-length
  // public orders: Array<{ restaurant: string; order: number ; dateTake: string; preparingTime: string, delivery_cost: number, tip: number, fastItBonus: number}> = [];//
  constructor(private router: Router,
              private alertController: AlertController,
              private authenticate: AuthenticationService,
              private delivererService: DeliveryService,
              private actionsService: ActionsService,
              private activatedRoute: ActivatedRoute ) {
                console.log('status deliverer controller', this.statusDeliverer);  
              }

  ngOnInit() {
    this.sector = this.activatedRoute.snapshot.paramMap.get('sector');
    this.idSector = this.activatedRoute.snapshot.paramMap.get('id');
    this.deliverer = new Deliverer();
    this.deliverer.orders = [];
    // const source = timer(4000, 7000);
    this.statusDeliverer = this.delivererService.currentUser?.status;
    console.log('status deliverer ngOninit', this.statusDeliverer);
    this.getOrderAvailable();

    const source = timer(4000, 7000);
    this.timerSubscription = source.subscribe(val => {
      this.second = val;
      this.getOrderAvailable(false);
    });
    setTimeout(() => {
      this.timerSubscription.unsubscribe();
    }, 1000000);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getOrderAvailable();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getOrderAvailable(displayToast = true) {
    const user = {user : this.userName, idSector: this.idSector};
    this.delivererService.getOrderAvailable(user).subscribe((response) => {
      this.orders = response?.orders;
      this.orders?.forEach( order => {
        order.amount /=  100;
      });
      if (displayToast) {
        this.actionsService.presentToastWithOptions("","arrow-up-outline", `${this.orders?.length} commande(s) disponible(s)`, "bottom");
      }
      console.log(this.orders);
    });
  }

  async presentAlertConfirm(orderId: number) {
    const alert = await this.alertController.create({
    header: 'CONFIRMATION',
      message: ' <strong>Etes-vous sur de bien vouloir accepter cette livraison?</strong>!!!',
      buttons: [
        {
          text: 'ANNULER',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ACCEPTER',
          handler: () => {
            console.warn('orderId', orderId);
            this.doAffectDeliverer(orderId);
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  // Affecter un livreur  à une commande
  private doAffectDeliverer(orderId: number) {
    this.delivererService.getOrderById(orderId).subscribe( currentOrder => {
      this.order = currentOrder;
      // console.log("currentOrder", currentOrder);
      this.delivererService.getDeliverer().subscribe( (deliverer) => {
        console.log('deliverer', deliverer);

        this.awaitingDelivery = deliverer?.orders?.filter(order => order?.date_delivered == null);
        
        console.log('awaitingdeliverer', this.awaitingDelivery);
        console.log('this.awaitingDelivery + 1 ', this.awaitingDelivery + 1 );

        // TODO: 10.01.2021 Ajouter 2 constantes ( Mail livreur admin && Nb de courses possible 06/02/2021 en bdd)
        const canAffectDeliverer = deliverer?.email?.toLowerCase() === this.userNameNoLimit.toLowerCase() ||
        this.awaitingDelivery == null || this.awaitingDelivery?.length + 1 <= this.nbDeliveryMax;

        // Avant d'affecter une livraison à un livreur on
        // regarde si il a atteint son nombre maximum de livraison
        // et ensuite on regarde si la commande n'a pas déjà été attribuée
        if (canAffectDeliverer) {
          if (currentOrder.deliverer == null && deliverer.id) {
            const dateTakenDeliverer = Date.now();
            this.saveOrderDeliverer(currentOrder.id, deliverer.id, dateTakenDeliverer, 3);
          } else {
            this.presentAlert();
          }
        } else {
          this.orderMaximumAlert();
        }
        });
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Commande déjà prise',
      buttons: ['OK']
    });

    await alert.present();
  }

  async orderMaximumAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Commande maximum atteinte',
      buttons: ['OK']
    });

    await alert.present();
  }

  private saveOrderDeliverer(orderId, delivererId, dateDelivery, status) {
    const dateTakenDeliverer = dateDelivery;

    const dateDelivered = '@' + Math.round(dateDelivery / 1000) ;

    let orderSave: any;
    orderSave = {
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: null,
        // status: 3,
      }
    };
    this.delivererService.saveOrderDeliverer(orderSave).subscribe( orderSaved => {
      this.router.navigate([`/pending-orders/`]);
    });
  }

  onLogout() {
    this.authenticate.logout();
  }

  onSubmit() {
    this.router.navigate(['pending-orders']);
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

}
