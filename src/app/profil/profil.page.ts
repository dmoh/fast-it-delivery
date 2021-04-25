import { Component, OnInit } from '@angular/core';
import { Deliverer } from '@app/_models/deliverer';
import { ActionsService } from '@app/_services/actions.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { DeliveryService } from '@app/_services/delivery.service';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  email: string;
  newPassword: string = "";
  password: string = "";
  error: string;
  private isKbis: boolean;
  private isSave: boolean;

  static notifInfoSaved = "Profil mis à jour.";
  static notifPassChanged = "Modification du mot de passe momentanément indisponible !";

  constructor(
    private deliveryService: DeliveryService,
    private actionsService: ActionsService,
    private authenticate: AuthenticationService,
    private userService: UserService) { }
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";

  ngOnInit() {
    this._userInfo = <Deliverer> JSON.parse( localStorage.getItem("userInfo"));
  }

  private _userInfo: Deliverer;

  get userInfo() {
    console.log("testinfouser", localStorage.getItem("userInfo"));
    return this._userInfo;
    return <Deliverer> JSON.parse( localStorage.getItem("userInfo")) ?? new Deliverer();
  }

  set userInfo(userInfo: Deliverer) {
    console.log("testinfouser", localStorage.getItem("userInfo"));
    this._userInfo = userInfo;
    // return <Deliverer> JSON.parse( localStorage.getItem("userInfo")) ?? new Deliverer();
  }

  onSaveDelivererInfo() {
    // https://entreprise.data.gouv.fr/api/sirene/v1/siret/
    
    // save informations deliverer
    const delivererInfo: any = {};
    delivererInfo.userName = this.userInfo.username;
    delivererInfo.siret = this.userInfo.siret;
    delivererInfo.firstName = this.userInfo.firstname;
    delivererInfo.lastName = this.userInfo.lastname;
    delivererInfo.phone = this.userInfo.phone;
    delivererInfo.city = this.userInfo.addresses[0].city;
    delivererInfo.street = this.userInfo.addresses[0].street;
    delivererInfo.zipcode = this.userInfo.addresses[0].zipCode;
    // console.log("delivererInfo", delivererInfo);
    const saveDeliverer$ = this.deliveryService.saveInfosDeliverer(delivererInfo);
    
    //  kbis a sauvegarder
    if(this.userInfo.siret && this.userInfo.siret != "") {
      return this.deliveryService.getKbis(this.userInfo.siret).subscribe(
        kbisRes => { 
          this.isKbis = (kbisRes.etablissement.siret == this.userInfo.siret);
          this.isSave = (true && this.isKbis);
          console.log("getKbis", kbisRes);
          saveDeliverer$.subscribe(success => this.successSaved(success));
        },
        error => {
          console.trace('error Kbis', error);
          this.isKbis = false;
          this.isSave = (true && this.isKbis);
          this.error = "Le Kbis renseigné est invalide/inconnu";
          this.actionsService.presentToast(this.error, 3000);
        }
      );
    }

    saveDeliverer$.subscribe( success => this.successSaved(success) );
  }

  successSaved(success: any) {
    // this.userService.getDeliverer("").subscribe( deliverer => {
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      this.actionsService.presentToast(ProfilPage.notifInfoSaved);
      console.log("save deliverer info success", success);
    // });
  }

  onChangePassword() {
    this.actionsService.presentToast(ProfilPage.notifPassChanged);
  }

  onLogout() {
    this.authenticate.logout();
  }
}
