import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';
import { ToastController } from '@ionic/angular';

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
   private router: Router,
   ) { }
   // imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  imgLogo: string = "/assets/fast_it.png";
  ngOnInit() {
  }

  async onSubmit() {
    const res = await this.auth.login(this.email, this.password).toPromise();
        // .subscribe((res) => {
        if (res === true) {
          // console.warn('test', res);
          this.router.navigate(['overview'], { queryParams: { begin: true } });
        }
        else {this.error = "Vous n'avez pas de profil Livreur"}
        // });
  }

  onLogout() {
    this.auth.logout();
  }

}
