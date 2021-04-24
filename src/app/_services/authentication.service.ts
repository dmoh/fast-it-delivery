import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router, public toastController: ToastController) { 
    const token = JSON.parse(localStorage.getItem('currentUser'));
    this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    if (token?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token.token}`
      });
    }
  }

  public headers: HttpHeaders;
  public get tokenUserCurrent(): string {
        console.warn(JSON.parse(localStorage.getItem('currentUser')));
        return JSON.parse(localStorage.getItem('currentUser')); // this.currentUserSubject.value.token;
  }

  urlApi: string = environment.apiUrl;

  login(email: string, password: string) {
    const optionRequete = {
      headers: this.headers
    };

    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, optionRequete)
      .pipe(map((user : any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        // this.currentUserSubject.next(user);
        const jwtDecode: any = jwt_decode(user.token);
        console.log("jwtDecode", jwtDecode);
          
        if (jwtDecode.username) {
          localStorage.setItem('username', jwtDecode.username);
        }

        if (jwtDecode.roles) {
          const roles = jwtDecode.roles;
          if (
              roles.indexOf('ROLE_SUPER_ADMIN') !== -1
              || roles.indexOf('ROLE_DELIVERER') !== -1
          ) {
            // add icon and restaurant
            localStorage.setItem('roles', JSON.stringify(roles));
            this.presentToastWithOptions("",'log-in',"Vous etes connecté", "bottom" );
            return true;
            // this.currentRolesSubject.next(roles);
          }
          this.presentToastWithOptions("", 'log-in', "Vous etes connecté", "bottom");
          return false;
        }
      }));
  }

  setDelivererStatus(status: boolean): Observable<any> {
    const optionRequete = {
      headers: this.headers
    };
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, optionRequete);
  }

  logout() {
    this.setDelivererStatus(false)
    .subscribe( x => {
      localStorage.clear();
      this.presentToastWithOptions("","log-out-outline","Vous avez été déconnecté");
      this.router.navigate(['login']);
    });
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
                                options = null,
                                duration: number = 2000) {

    const buttonSuccess : any = {
      // icon: 'star',
      // side: 'start',
      // icon: 'star',
      // text: 'Favorite',
      side: 'start',
      icon,
      text: '',
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


}
