import { Injectable } from '@angular/core';
import {AuthenticationService} from "@app/_services/authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "@environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import { Deliverer } from '@app/_models/deliverer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  headers: any ;
  urlApi: string = environment.apiUrl;

  private _currentUserSubject: BehaviorSubject<Deliverer>;

  public set currentUser(currentUser: Deliverer) {
    this._currentUserSubject.next(currentUser);
  }
  public get currentUser(): Deliverer {
    return this._currentUserSubject?.value;
  }

  public appPagesSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>( [
    {
      title: 'Vue Globale',
      url: '/overview',
      icon: 'eye',
      displayDefault: true,
      // icon: 'mail'
    },
    {
      title: 'Commandes en cours',
      url: '/pending-orders',
      icon: 'bicycle',
      displayDefault: true,
      // icon: 'paper-plane'
    },
    {
      title: 'Commandes disponibles',
      url: '/available-orders',
      icon: 'flash',
      // icon: 'notifications-circle'
    },
    {
      title: 'Commandes livrées',
      url: '/delivered-orders',
      icon: 'checkmark-done',
      displayDefault: true,
      // url: '/sector/delivered-orders',
      // icon: 'heart'
    },
  ]);

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

  setTokenFcm(tokenFcm, platform = undefined) {
    return this.http.post<any>(`${this.urlApi}/set/tokenfcm/deliverer`,
      {
        tokenFcm,
        platform
      },
      {headers: this.headers} );
  }

  /**
   * 
   * @param id @description non utilisé dans le backend
   * @param request 
   * @returns 
   */
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
    return this.http.post<any>(`${this.urlApi}/deliverer/info`, null,{headers: this.headers}).pipe( 
      map ((deliverer : Deliverer) => {
        this.currentUser = deliverer;
        let appPageTable = this.appPagesSubject.value;
        appPageTable = [
          {
            title: 'Vue Globale',
            url: '/overview',
            icon: 'eye',
            displayDefault: true,
            // icon: 'mail'
          },
          {
            title: 'Commandes en cours',
            url: '/pending-orders',
            icon: 'bicycle',
            displayDefault: true,
          },
        ];

        // On trie la liste des secteurs par ordre alphaetique
        deliverer.sectors = deliverer?.sectors?.sort( function(sectorA, sectorB) {         
          return sectorA.name.localeCompare(sectorB.name);
        });

        deliverer?.sectors?.forEach( sector => {
          const urlSector = `/sector/${sector.id}/${(<string>sector.name).trim().replace(' ','')}`;
          appPageTable.push({
            title: `Commandes ${sector.name}`,
            url: urlSector,
            icon: 'flash',
          })
        });

        appPageTable.push(
          {
            title: 'Commandes livrées',
            url: '/delivered-orders',
            icon: 'checkmark-done',
            displayDefault: true,
          },
        );

        this.appPagesSubject.next(appPageTable);
        return deliverer;
      })
    );
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

  setDelivererStatus(status: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, { headers: this.headers});
  }
}
