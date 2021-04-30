import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@app/_services/authentication.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;
  urlApi: string = environment.apiUrl;
  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    const token = JSON.parse(localStorage.getItem('currentUser'));
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    if (token?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token.token}`
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

  getDeliverer(username: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/info`, null,{headers: this.headers});
  }

  setDelivererStatus(status: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, { headers: this.headers});
  }
}
