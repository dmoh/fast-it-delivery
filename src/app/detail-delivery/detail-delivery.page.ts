import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeliveryService} from "@app/_services/delivery.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-detail-delivery',
  templateUrl: './detail-delivery.page.html',
  styleUrls: ['./detail-delivery.page.scss'],
})
export class DetailDeliveryPage implements OnInit {
  hasDeliveryCode: boolean = true;
  delivererForm: FormGroup;
  isValid: boolean;
  orderId: string;
  order: any;
  isDelivering: boolean;
  code: string;
  public orders: Array<{ order_business_name: string; order_business_street: string ; order_business_city: string; order_business_zipCode: string, order_business_phone: string,
    order_customer_name: string; order_customer_street: string ; order_customer_city: string; order_customer_zipCode: string, order_customer_phone: string, order_customer_comment: string}> = [];

  constructor(private fb: FormBuilder,
              private deliveryService: DeliveryService,
              private router: Router,
              //private pickupOrderModal: NgbModal,
              public alertController: AlertController,
              private route: ActivatedRoute) { this.isDelivering = null;
    this.orders.push({
      //business
      order_business_name: 'Panama',
      order_business_street: '11 rue CLAUDE HUGARD',
      order_business_city: 'CLUSES',
      order_business_zipCode: '74300',
      order_business_phone: '0625557719',

      //customer
      order_customer_name: 'Sofian AYAYDA',
      order_customer_street: '34 avenue GEORGES CLEMENCEAU',
      order_customer_city: 'CLUSES',
      order_customer_zipCode: '74300',
      order_customer_phone: '0625557719',
      order_customer_comment: 'jai déménagé'


    });
  }

  ngOnInit() : void {this.isValid = true;
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.deliveryService.getDeliverer().subscribe( deliverer => {
      console.log("deliverer", deliverer);
      this.deliveryService.getOrderById(+this.orderId).subscribe( orderById => {
        console.log("order", orderById);

        console.log(orderById.deliverer?.id);
        console.log(deliverer.id);
        if (orderById.deliverer?.id !== deliverer.id) {
          this.router.navigate(['/delivery/awaiting-delivery']);
        }
        //let order: Order = new Order();

        this.order = orderById;
        this.isDelivering = this.order.status >= 3 && this.order.date_delivered == null ;

        this.hasDeliveryCode = this.order.deliverCode != null;

        this.delivererForm = this.fb.group({
          code: ["", Validators.required],
          notCode: false
        });
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    })
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

  private finalizeDelivery() {
    let order: any;
    let dateDelivered = '@' + Math.round(Date.now()/1000) ;

    order = {
      order : {
        order_id: this.orderId,
        date_delivered: dateDelivered,
        status: 4,
      }
    };
    this.deliveryService.saveOrderFinal(order).subscribe( res => {
      this.router.navigate(['/delivery/awaiting-delivery']);
    });
  }

  private saveOrderDeliverer(orderId, delivererId, dateDelivery, refresh) {
    let dateTakenDeliverer = dateDelivery;

    let dateDelivered = '@' + Math.round(dateDelivery/1000) ;

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
            console.warn("success", next);
            window.location.reload();
          }
        },
        error => {
          console.error("error", error);
        }
    );
  }

  onSubmit() {

    this.router.navigate(['detail-delivery'])

  }

}
