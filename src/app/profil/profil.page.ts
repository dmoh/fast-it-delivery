import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  email: string;
  password: string;
  error: string;

  constructor() { }
  imgLogo: string = "https://fast-it.fr/assets/logo_fastit.jpg";

  ngOnInit() {
  }

}
