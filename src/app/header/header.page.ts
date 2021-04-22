import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  
  @Input() title;

  constructor(private authenticate: AuthenticationService) { }

  ngOnInit() {
    // alert(this.title);
  }

  onLogout() {
    this.authenticate.logout();
  }

}
