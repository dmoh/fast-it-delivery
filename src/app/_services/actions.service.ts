import { Injectable } from '@angular/core';
import { ModalPageComponent } from '@app/core/modal-page/modal-page.component';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController
  ) { }

  public async presentActionSheet(title: string = "Modify your album", listElements: Array<any> = null) {

    let buttons = [];
    listElements?.forEach( elem => {
      buttons.push(elem);
    })

    buttons = buttons.length != 0 ? buttons : [{
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
        }]
    ;

    const actionSheet = await this.actionSheetController.create({
      header: title,
      buttons: buttons,
    });
    actionSheet.present();
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
  duration: number = 2000) {
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
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentModal() {
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
