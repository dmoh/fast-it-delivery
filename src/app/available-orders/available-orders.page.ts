import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Observable, timer} from 'rxjs';
import {Restaurant} from '@app/_models/restaurant';
import {Deliverer} from '@app/_models/deliverer';
import {Order} from '@app/_models/order';
import * as fasteatconst from '@app/_util/fasteat-constants';
import {AuthenticationService} from '@app/_services/authentication.service';
import {DeliveryService} from '@app/_services/delivery.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-available-orders',
  templateUrl: './available-orders.page.html',
  styleUrls: ['./available-orders.page.scss'],
})
export class AvailableOrdersPage implements OnInit {
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  commerce: Restaurant;
  deliverer: Deliverer;
  orders: any[] = [];
  order: Order;
  orderCurrentId: number;
  awaitingDelivery: any;
  error: string;
  headers: any;
  fastEatConst = fasteatconst;
  statusDeliverer: boolean=false;

  // userNameNoLimit = 'fasteat74@gmail.com';
  userNameNoLimit = 'test@gmail.com';
  nbDeliveryMax = 1;

  secondes: number;

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

  // tslint:disable-next-line:max-line-length
  // public orders: Array<{ restaurant: string; order: number ; dateTake: string; preparingTime: string, delivery_cost: number, tip: number, fastItBonus: number}> = [];//
  constructor(private router: Router,
              public alertController: AlertController,
              private authenticate: AuthenticationService,
              private deliveryService: DeliveryService,
              private activatedRoute: ActivatedRoute) {
                console.log('status deliverer controller', this.statusDeliverer);  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getOrderAvaible();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.deliverer = new Deliverer();
    this.deliverer.orders = [];
    const source = timer(4000, 7000);
    this.statusDeliverer = localStorage.getItem("statusDeliverer") == "true";
    console.log('status deliverer ngOninit', this.statusDeliverer);
    
    this.getOrderAvaible();
  }

  getOrderAvaible() {
    this.deliveryService.getOrderAvailabe().subscribe((response) => {
      console.log(response);
      this.orders = response.orders;
      this.orders.forEach( order => {
        order.amount /=  100;
      });
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
    this.deliveryService.getOrderById(orderId).subscribe( currentOrder => {
      this.order = currentOrder;
      // console.log("currentOrder", currentOrder);
      this.deliveryService.getDeliverer().subscribe( (deliverer) => {
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
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe( orderSaved => {
      // this.router.navigate([`/detail-delivery/${orderId}`]);
      this.router.navigate([`/pending-orders/`]);
    });
  }

  onLogout() {
    this.authenticate.logout();
  }

  onSubmit() {
    this.router.navigate(['pending-orders']);
  }
}
