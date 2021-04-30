import { Injectable } from '@angular/core';
import {AuthenticationService} from "@app/_services/authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  headers: any ;
  urlApi: string = environment.apiUrl;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    const token = JSON.parse(localStorage.getItem('currentUser'));
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    if (token?.token) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token.token}`
      });
    }
  }

  getOrderAnalize(id: number, request = null): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/${id}/analyze`, request, {headers: this.headers} );
  }

  getCurrentOrders(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/current_orders`, null, {headers: this.headers});
  }

  getInfosDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/show`, {headers: this.headers});
  }

  getDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/info`, {headers: this.headers});
  }

  getKbis(noKbis: string): Observable<any> {
    return this.http.get<any>(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/` + noKbis);
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderId}`, {headers: this.headers});
  }

  saveOrderFinal(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save/final`, request, {headers: this.headers});
  }

  saveOrderDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save_deliverer`, request, {headers: this.headers});
  }

  getOrderAvailable(request: any): Observable<any>{
    return this.http.post<any>( `${this.urlApi}/order/available`, request, {headers: this.headers});
  }

  saveInfosDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/user/save_deliverer`, request, {headers: this.headers});
  }
}
