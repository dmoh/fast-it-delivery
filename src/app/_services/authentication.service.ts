import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Deliverer } from '@app/_models/deliverer';
import { User } from '@app/_models/user';
import { ActionsService } from './actions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentTokenSubject: BehaviorSubject<any>;
  public get currentTokenValue(): any {
    return this.currentTokenSubject?.value;
  }

  public headers: HttpHeaders;

  public urlApi: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, public actionsService: ActionsService) { 
    this.currentTokenSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("currentToken")));

    this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    if(localStorage.getItem("currentToken"))
      console.log("localStorage.getItem(currentToken)", JSON.parse(localStorage.getItem("currentToken")));
    
    console.log("currentTokenSubject.value.token", this.currentTokenSubject.value?.token);
    if (this.currentTokenSubject.value?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.currentTokenSubject.value.token}`
      });
    }
  }

  public login(email: string, password: string) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    if (this.currentTokenSubject.value?.token) {
      console.log("this.currentTokenSubject.value?.token",this.currentTokenSubject.value?.token);
      alert("currentTokenSubject");

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.currentTokenSubject.value.token}`
      });
    }

    const optionRequete = {
      headers: this.headers
    };

    console.log("optionRequete", optionRequete);

    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, optionRequete)
      .pipe(
        map((user : any) => {
          // Store user details and jwt token in local storage to keep user logged in between page refreshes
          this.currentTokenSubject.next(user);
          localStorage.setItem('currentToken',JSON.stringify(user) );

          const jwtDecode: any = jwt_decode(user.token);
          console.log("jwtDecode", jwtDecode);
          
          // localStorage.setItem('currentUser', JSON.stringify(user));
          if (jwtDecode.username) {
            // USER Account
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
              this.actionsService.presentToastWithOptions("",'log-in',"Vous êtes connecté", "top","",null,2000);
              return true;
              // this.currentRolesSubject.next(roles);
            }
            this.actionsService.presentToastWithOptions("", 'log-in', "Vous êtes connecté", "top","",null,2000);
            return false;
          }
        }),
        catchError(x => {
          console.log(x);
          this.actionsService.presentToastWithOptions("", 'alert-circle-outlinef', x.message, "top","",null,2000);
          return null;
        })
      );
  }

  public setDelivererStatus(status: boolean): Observable<any> {
    // const token = JSON.parse(localStorage.getItem('currentUser'));
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    if (this.currentTokenValue?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.currentTokenValue.token}`
      });
    }

    const optionRequete = {
      headers: this.headers
    };
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, optionRequete);
  }

  public logout() {
    const logOutAction = this.setDelivererStatus(false).pipe(
      map( x => this.logOutAction(x) ),
      catchError( err => this.actionsService.presentToastWithOptions(
        "","alert-circle-outline",
        err.message,"top","",null,2000) )
    );

    this.actionsService.presentAlertConfirm(
                          '<strong>Etes-vous sur de vouloir vous déconnecter ?</strong>',
                          logOutAction
    );
  }

  private logOutAction (action: any) {
      localStorage.clear();
      this.currentTokenSubject.next(null);
      this.actionsService.presentToastWithOptions("","log-out-outline","Vous avez été déconnecté","top", "", null, 2000);
      this.router.navigate(['login']);
  }

}
