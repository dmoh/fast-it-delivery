import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import { Deliverer } from '@app/_models/deliverer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;
  urlApi: string = environment.apiUrl;

  private _currentUserSubject: BehaviorSubject<Deliverer>;

  public set currentUser(currentUser: Deliverer) {
    this._currentUserSubject.next(currentUser);
  }
  public get currentUser(): Deliverer {
    return this._currentUserSubject?.value;
  }

  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    this._currentUserSubject = new BehaviorSubject<Deliverer>(null);
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    if (this.authenticate.currentTokenValue?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.authenticate.currentTokenValue.token}`
      });
    }
  }

  registerUser(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/add/user`,{user: userNew}, {headers: this.headers});
  }

  passwordForgot(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/password`,{ user: userNew}, {headers: this.headers});
  }

  savePhoneNumber(phone: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/phone/save`,{ phoneUser: phone}, {headers: this.headers});
  }

  getUserAddresses(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/user/address`, {headers: this.headers});
  }
  
  getRestaurantIdByUsername(username: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/restaurant`, {email: username},{headers: this.headers});
  }

  getDeliverer(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/info`, null,{headers: this.headers}).pipe( 
      map ((deliverer : Deliverer) => this.currentUser = deliverer)
    );
  }

  setDelivererStatus(status: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, { headers: this.headers});
  }
}
