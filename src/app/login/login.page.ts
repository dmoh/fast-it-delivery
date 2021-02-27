import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  error: string;
  constructor(
   private auth: AuthenticationService,
   private router: Router
   ) { }
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  ngOnInit() {
  }

  onSubmit() {
    this.auth.login(this.email, this.password)
        .subscribe((res) => {
        if (res === true) {
          this.router.navigate(['overview']);
          console.warn('test', res);
          }
        else {this.error = "Vous n avez pas de profil Livreur"}
        });


  }

}
