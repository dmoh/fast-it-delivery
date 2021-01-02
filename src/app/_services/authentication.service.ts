import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MDk2Mjg0NDIsImV4cCI6MTYxMDIzMzI0Miwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9BRE1JTiIsIlJPTEVfREVMSVZFUkVSIl0sInVzZXJuYW1lIjoidGVzdEBnbWFpbC5jb20ifQ.kxagZq5yqU5KVpBDSmxBkhA1ElXRjKIAje5_4hhmCAJ9lvr0kiIYwc7BHV7k9Uaa-CbecrVJO4n_KzMo5I_GjB5TavniTtWOoF1QjSeWwvnkhNr44rLZzoB-QXLBktbkpMWv3XyZgksXsdqKlubLA99o_bK_h54DYdsoLFC7mW3D9O7CIbBaKq0_8YC0UpZAHIjvVhnwoS2yq4ss0jJN0WVNhSEQY_-N8nJTKBwxi1x-rMrnqN19FDU7zPaBIZy9Me5A2ln4CRrTjpcFlt96PES2Vn5KDOi6t5w14j-j5DxZZ_yLjAoBCYlWZt8mQNqjuOobz1EV1shEkhTHrej8CA0TMjhtKl_AoeGqTdZHf4rM2XqgI8DxyeG08xxlYNFU0EvlR3jDDgC00mpUoSnqC3_q6Kq-zBhzXOQz778ZdDRq8oAKmL1Mg_DyB8UIs477DFE9akc0hpd1HsxnOiw3nAuGfCvlMI4fSJwwF7DYtoW6xvVQZCFRxNmbIUVus-mysuDkgNsKNa3-WSIXOw3dkhf3_B7IUH-SZdkmgdjF5m-Q9t_m1NQ8bTgBVHoKCQBsvCBi3oOPeGwxtsH0xtUa1C0_tTwoBAR3Q5pBlOOEhKQiOCop7YUqZErNIFKOuzsRX23kh_rPXj29rd-b1MP4UgLLTbJux6LcFBCqX6PqQ-U";
  constructor(private http: HttpClient) { }

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

}
