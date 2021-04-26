import { Injectable } from '@angular/core';
import { ModalPageComponent } from '@app/core/modal-page/modal-page.component';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController
  ) { }

  public async presentActionSheet(title: string = "Modify your album", listElements: Array<any> = null) {

    let buttons = [];
    listElements?.forEach( elem => {
      buttons.push(elem);
    })

    buttons = buttons.length != 0 ? buttons : [{
          text: 'Menu1',
          role: 'menu1',
          handler: () => {
            console.log('Menu1 clicked');
          }
        },,{
          text: 'Menu2',
          role: 'menu2',
          handler: () => {
            console.log('Menu2 clicked');
          }
        }]
    ;

    const actionSheet = await this.actionSheetController.create({
      header: title,
      buttons: buttons,
    });
    actionSheet.present();
  }
 
  async presentAlertConfirm(message: string, action1: Observable<any> = null,  action2: any = null) {
    const alert = await this.alertController.create({
    header: 'CONFIRMATION',
      message,
      buttons: [
        {
          text: 'ANNULER',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (x) => {
            console.log('cancel');
            action2;
          }
        }, {
          text: 'ACCEPTER',
          handler: () => {
            console.warn('accept');
            action1?.subscribe();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  public async presentToast(message: string = 'Your settings have been saved.', duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
    });
    toast.present();
  }

  public async presentToastWithOptions(header: any = 'Toast header',
  icon: any = 'star',
  message: any = 'Click to Close',
  position: any = "bottom",
  textStart: any = "",
  options = null,
  duration: number = null) {
    const buttonSuccess : any = {
        // icon: 'star',
        // side: 'start',
        // icon: 'star',
        // text: 'Favorite',
        side: 'start',
        icon,
      text: textStart,
      handler: () => {
        console.log('Favorite clicked');
      }
    };

    const buttonCancel : any = {
      text: 'x',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    };

    const toast = await this.toastController.create({
      header,
      message,
      position,
      buttons: [
        buttonSuccess, buttonCancel
      ]
    });
    if (duration) {
      toast.duration = duration;
    }
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  public async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstName': 'Test',
        'lastName': 'Adams',
        'middleInitial': 'N',
        swipeToClose: true,
        presentingElement: await this.modalController.getTop(),
      }
    });
    return await modal.present();
  }
}
