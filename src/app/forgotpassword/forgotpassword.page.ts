import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {UserService} from "@app/_services/user.service";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  email: string;
  error: string;
  submitted: boolean;
  info: string;
  constructor(
      private userService: UserService
  ) {
    this.submitted = false;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

    this.userService.passwordForgot(this.email)
        .subscribe((res) => {
          if (res.ok) {
            this.info = 'Votre mot de passe a bien été modifié';
          } else if (res.error) {
            this.error = res.error;
          }
        });
  }
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";

}
