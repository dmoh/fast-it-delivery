import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeliveryService} from '@app/_services/delivery.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import { Order } from '@app/_models/order';
import {Restaurant} from "@app/_models/restaurant";
import {User} from "@app/_models/user";
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-detail-delivery',
  templateUrl: './detail-delivery.page.html',
  styleUrls: ['./detail-delivery.page.scss'],
})
export class DetailDeliveryPage implements OnInit {
  hasDeliveryCode = true;
  delivererForm: FormGroup;
  isValid: boolean;
  orderId: string;
  order: Order;
  
  _isDelivering: boolean;
  set isDelivering(order: any) {
      this._isDelivering = order?.status >= 3 && order?.date_delivered == null ;
  }
  get isDelivering() {
      return this._isDelivering;
  }

  constructor(private fb: FormBuilder,
              public alertController: AlertController,
              private deliveryService: DeliveryService,
              private authenticate: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) {
    // this.route.queryParams.subscribe(params => {
    //  if (this.router.getCurrentNavigation().extras.state) {
    //    this.orderId = this.router.getCurrentNavigation().extras.state.orderId;
     //   console.log('orderId du détail 1', this.orderId);
     // }
    // });

    this.isDelivering = null;
    this.order = new Order();
    this.order.business = new Restaurant();
    this.order.customer = new User();

  }

  ngOnInit() {
    this.isValid = true;
    // this.orderId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.orderId = this.router.getCurrentNavigation().extras.state.orderId;
          this.deliveryService.getDeliverer().subscribe(deliverer => {
            console.log('deliverer', deliverer);
            console.log('orderId du détail', this.orderId);
            this.deliveryService.getOrderById(+this.orderId).subscribe(orderById => {
              console.log('orderById', orderById);
              if (orderById.deliverer?.id !== deliverer.id) {
                this.router.navigate(['available-orders']);
              }
              // let order: Order = new Order();
              this.order = orderById;
              // alert(this.order);
              console.log(this.order);

              // this.isDelivering = this.order.status >= 3 && this.order.date_delivered == null;
              this.isDelivering = this.order;

              this.hasDeliveryCode = this.order.deliverCode != null;

              this.delivererForm = this.fb.group({
                code: ['', Validators.required],
                notCode: false
              });
            });
          });
        }
    });
  }

  public linkToAddresses(address: string) {
    const direction = encodeURI(address);
    if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf('iPhone') !== -1) ||
        (navigator.platform.indexOf('iPod') !== -1) ||
        (navigator.platform.indexOf('iPad') !== -1)) {
      window.open('maps://maps.google.com/maps?daddr=' + direction);
    }
    else {
      window.open('https://maps.google.com/maps?daddr=' + direction);
    } /* else use Google */
  }

  onValidateDelivery(): void {
    if (this.isDelivering) {
      if (this.hasDeliveryCode && !this.delivererForm.value.notCode) {
        this.isValid = this.delivererForm.value.code === this.order.deliverCode;
      }

      if (this.delivererForm.value.notCode || this.isValid) {
        this.finalizeDelivery();
      }
      else {
        return;
      }
    }
  }

  onValidateWithoutCode() {
    this.delivererForm.value.notCode = true;
  }

  async onTakenDelivery() {
    if (this.order && !this.isDelivering){

        const modalRef = await this.alertController.create({
        header: 'CONFIRMATION',
          message: ' <strong> Avez vous récuperé la commande ? </strong>',
          buttons: [
            {
              text: 'Non pas encore',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Oui je confirme',
              handler: () => {
                console.info('orderId', this.order.id);
                this.saveOrderDeliverer(this.order.id, this.order.deliverer.id, Date.now(), true);
              }
            }
          ]
        });
    
        await modalRef.present();
        const result = await modalRef.onDidDismiss();
        console.log(result);
      // }

      // const modalRef = this.pickupOrderModal.open(PickupOrderModalComponent, {
      //   backdrop: 'static',
      //   keyboard: true,
      //   size: 'lg',
      // });

      // modalRef.componentInstance.order = this.order;
      // modalRef.result.then((result) => {
      //   if (result.response) {
        // }
      // });
      // this.saveOrderDeliverer(this.order.id, this.order.deliverer.id, Date.now(), true);
    }
  }

  private async finalizeDelivery() {
    let order: any;
    const dateDelivered = '@' + Math.round(Date.now() / 1000) ;

    order = {
      order : {
        order_id: this.orderId,
        date_delivered: dateDelivered,
        status: 4,
      }
    };

    const modalRef = await this.alertController.create({
      header: 'CONFIRMATION DE LIVRAISON',
        message: ' <strong> Confirmez-vous avoir livré la commande ? </strong>',
        buttons: [
          {
            text: 'Non pas encore',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Oui je confirme',
            handler: () => {
              console.info('orderId', this.order.id);
              this.deliveryService.saveOrderFinal(order).subscribe( res => {
                this.router.navigate(['pending-orders']);
              });
            }
          }
        ]
      });
  
      await modalRef.present();
      const result = await modalRef.onDidDismiss();
      console.log(result);
  }

  private saveOrderDeliverer(orderId, delivererId, dateDelivery, refresh) {
    const dateTakenDeliverer = dateDelivery;

    const dateDelivered = '@' + Math.round(dateDelivery / 1000) ;

    let orderSave: any;
    orderSave = {
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: dateTakenDeliverer,
        status: 3,
      }
    };
    console.log(orderSave);
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe(
        next => {
          if (refresh) {
            console.warn('success', next);
            this.isDelivering(orderSave);
            // window.location.reload();
          }
        },
        error => {
          console.error('error', error);
        }
    );
  }

  onSubmit() {
    this.router.navigate(['pending-orders']);
  }

  onLogout() {
    this.authenticate.logout();
  }

}
