import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";


@Component({
  selector: 'app-available-orders',
  templateUrl: './available-orders.page.html',
  styleUrls: ['./available-orders.page.scss'],
})
export class AvailableOrdersPage implements OnInit {
  secondes: number;
  lastUpdate = new Promise((resolve, reject) => {
    const date = new Date();
    setTimeout(
        () => {
          resolve(date);
        }, 2000
    );
  });

  public orders: Array<{ restaurant: string; order: number ; dateTake: string; preparingTime: string, delivery_cost: number, tip: number, fastItBonus: number}> = [];
  constructor(private router: Router,
              public alertController: AlertController,) {
    for (let i = 1; i < 11; i++) {
      this.orders.push({
        restaurant: 'Panama',
        order: i,
        dateTake: '02-01-2021 13:56:00',
        preparingTime: '(15-30 min)',
        delivery_cost: 3.5,
        tip: 0.5,
        fastItBonus: 0


      });
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
    header: 'CONFIRMATION',
      message: ' <strong>Etes vous sure de bien vouloir accepter cette livraison?</strong>!!!',
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
          handler: () => {this.router.navigate(['pending-orders'])
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  ngOnInit(){}

  reload()  {
    this.ngOnInit();

  }

  onSubmit() {

    this.router.navigate(['pending-orders'])

  }
}
