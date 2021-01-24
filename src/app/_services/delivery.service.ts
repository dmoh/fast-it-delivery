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
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    this.headers.append(`Authorization`, `Bearer ${this.authenticate.tokenUserCurrent}`) ;

  }

  getOrderAnalize(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/${id}/analyze`,
        {headers: this.headers});
  }

  getDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/info`,
        this.headers);
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderId}`,
        this.headers);
  }

  saveOrderFinal(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save/final`, request, this.headers);
  }

  saveOrderDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save_deliverer`, request, this.headers);
  }

}
