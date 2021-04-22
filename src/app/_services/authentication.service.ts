import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  public get tokenUserCurrent(): string {
        console.warn(JSON.parse(localStorage.getItem('currentUser')));
        return JSON.parse(localStorage.getItem('currentUser')); // this.currentUserSubject.value.token;
  }
  login(email: string, password: string) {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, optionRequete)
        .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          // this.currentUserSubject.next(user);
          const jwtDecode = jwt_decode(user.token);
          console.log("jwtDecode", jwtDecode);
          // @ts-ignore
          if (jwtDecode.roles) {
            // @ts-ignore
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

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
