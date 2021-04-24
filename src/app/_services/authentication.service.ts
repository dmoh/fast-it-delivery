import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { 
    const token = JSON.parse(localStorage.getItem('currentUser'));
    this.optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    if (token.token) {
      this.optionRequete = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token.token}`
        })
      };
    }
  }

  public get tokenUserCurrent(): string {
        console.warn(JSON.parse(localStorage.getItem('currentUser')));
        return JSON.parse(localStorage.getItem('currentUser')); // this.currentUserSubject.value.token;
  }

  optionRequete: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  urlApi: string = environment.apiUrl;

  login(email: string, password: string) {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, this.optionRequete)
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
              return true;
            // this.currentRolesSubject.next(roles);
          }
          return false;
        }
      }));
  }

  setDelivererStatus(status: boolean): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/updateStatus/save`,{ statusDeliverer: status}, this.optionRequete);
  }

  logout() {
    localStorage.clear();
    this.setDelivererStatus(false)
        .subscribe();
    this.router.navigate(['login']);
  }

}
