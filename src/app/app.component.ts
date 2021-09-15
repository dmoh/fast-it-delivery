import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from '@environments/environment';
import { Deliverer } from './_models/deliverer';
import { Router } from '@angular/router';
import { DeliveryService } from './_services/delivery.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { ActionsService } from './_services/actions.service';

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
    private firebase: FirebaseX,
    private actionsService: ActionsService,
    private router: Router,
  ) {
  }

  initializeApp() {
    this.platform.ready().then( async () => {

      this.paramIndex = this.appPages.length + 2;
      console.log("initializeApp paramIndex", this.paramIndex);

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.firebase.getId().then( id => console.log('id', id));
      this.firebase.getCurrentUser()
      .then(user => console.log('user', user))
      .catch(err => console.log('getcurruser', err));
      
      // alert("init");
      this.firebase.getToken()
      .then( token => {
        console.log(`The token is`, token);
        console.log(`The token type`, typeof(token));
      })
      .catch(err => console.log("err token", err));
      
      const token = await this.firebase.getToken();
      console.log(`The token async is`, token);
      
      if (this.platform.is('ios')) {
        this.firebase.grantPermission().then(hasPermission => console.log(hasPermission ? 'granted' : 'denied'));
    
        this.firebase.onApnsTokenReceived().subscribe(token => console.log('PUSH_TOKEN: IOS_TOKEN: ' , token));
      }
      
      this.firebase.onMessageReceived().subscribe(
        data => {
          this.actionsService.presentToast("Reception d'une notification");
          console.log(`FCM message:`, data);
        },
        err => console.log("msg", err) 
      );
        
      this.firebase.onTokenRefresh().subscribe(
        data => console.log(`FCM token refresh: ${data}`),
        error => console.log("error", error)
      );

      this.firebase.listChannels()
      .then(channels => {
        console.log(`listChannels is`, channels);
        (<Array<any>> channels)?.forEach( channel => {
          console.log("ID: " + channel.id + ", Name: " + channel.name);
        });
      })
      .catch(err => console.log("err listChannels", err));

      this.firebase.getInfo()
      .then(info => {
        console.log("getInfo", info);
      })
      .catch(err => console.log("err getInfo", err));


    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('sector/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    console.log("ngOnInit paramIndex", this.paramIndex);

    this.initializeApp();
  }
}
