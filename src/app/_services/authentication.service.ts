import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
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
            console.warn('CurrentUser', JSON.stringify(user));
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
