import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from '@environments/environment';
import { Deliverer } from './_models/deliverer';
import { Router } from '@angular/router';
import { DeliveryService } from './_services/delivery.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public paramIndex = 0;

  /**
   * @description userName recuperé dans le localstorage 
   * "stocké a la connexion/authentication_token x= connexion/api/login_check"
   */
  public get userName () {
    // console.log("userName",localStorage.getItem('username'));
    return localStorage.getItem('username') ?? "livreur@fast-it.fr";
  }

  /**
  * @description userInfo recuperé dans le localstorage "stocké à la connexion"
  */
  public get userInfo (): Deliverer {
    // console.log("userInfo", <Deliverer> JSON.parse(localStorage.getItem('userInfo')));
    // return <Deliverer> JSON.parse(localStorage.getItem('userInfo')) ?? null;
    return this.delivererService.currentUser;
  }

  fastOn = environment.fastOnline;
  fastOff = environment.fastOff;
  // sectors = new Array<any>();

  public get statusDeliverer () {
    return this.delivererService.currentUser?.status ?? false
  }

  // public appPages: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>( [
  //   {
  //     title: 'Vue Globale',
  //     url: '/overview',
  //     icon: 'eye',
  //     displayDefault: true,
  //     // icon: 'mail'
  //   },
  //   {
  //     title: 'Commandes en cours',
  //     url: '/pending-orders',
  //     icon: 'bicycle',
  //     displayDefault: true,
  //     // icon: 'paper-plane'
  //   },
  //   {
  //     title: 'Commandes disponibles',
  //     url: '/available-orders',
  //     icon: 'flash',
  //     // icon: 'notifications-circle'
  //   },
  //   {
  //     title: 'Commandes livrées',
  //     url: '/delivered-orders',
  //     icon: 'checkmark-done',
  //     displayDefault: true,
  //     // url: '/sector/delivered-orders',
  //     // icon: 'heart'
  //   },
  // ]);

  // public indexParams = this.appPages.length + 1;
  // public paramIndex = this.appPages.length + 1;

  public get appPages(): Array<any> {
    return this.delivererService.appPagesSubject.value;
  }

  public params = [{
      title: 'Paramètres du profil',
      url: '/profil',
      icon: 'settings',
      // icon: 'person-circle'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private delivererService: DeliveryService,
    private router: Router,
  ) {
    this.initializeApp();
    this.paramIndex = this.appPages.length + 1;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('sector/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
