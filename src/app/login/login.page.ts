import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '@app/_services/authentication.service';
import {Router} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  error: string;
  hide: boolean = true;
  constructor(
   private auth: AuthenticationService,
   private firebase: FirebaseX,
   private router: Router,
   ) { }
   // imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";
  imgLogo: string = "/assets/fast_it.png";
  ngOnInit() {
    // on reinitialise le user token 
    // localStorage.removeItem("currentToken");
    console.warn(this.auth.currentTokenValue);
    this.email = localStorage.getItem('username');
    if(this.auth.currentTokenValue && this.auth.currentTokenValue.token){
      if(this.auth.getPageAccess(this.auth.currentTokenValue)) {
        this.router.navigate(['overview']);
      }
    }

    this.firebase.onTokenRefresh().subscribe(
      data => {
        console.log(`FCM token refresh: ${data}`);
        // alert(data);
      },
      error => console.log("error", error)
    );
  }

  async onSubmit() {
    const res = await this.auth.login(this.email, this.password).toPromise();
        // .subscribe((res) => {
        if (res === true) {
          // console.warn('test', res);
          // this.router.navigate(['overview'], { queryParams: { begin: true } });
          this.router.navigate(['overview']);
        }
        else {
          this.error = "Vous n'avez pas de profil Livreur"
        }
        // });
  }

  onLogout() {
    this.auth.logout();
  }

}
