import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from '@environments/environment';
import { Deliverer } from './_models/deliverer';
import { Router } from '@angular/router';
import { DeliveryService } from './_services/delivery.service';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { ActionsService } from './_services/actions.service';
import { ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import { Network } from "@ionic-native/network/ngx";
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';

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
    return localStorage.getItem('username') ?? "livreur@fast-it.fr";
  }

  /**
  * @description userInfo recuperé dans le localstorage "stocké à la connexion"
  */
  public get userInfo (): Deliverer {
    return this.delivererService.currentUser;
  }

  fastOn = environment.fastOnline;
  fastOff = environment.fastOff;

  public get statusDeliverer () {
    return this.delivererService.currentUser?.status ?? false
  }

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

  networkSubject;
  timerSubscription: Subscription;
  second: number;
  
  get  notificationNumber () {
    return this.firebase?.getBadgeNumber();
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private delivererService: DeliveryService,
    private firebase: FirebaseX,
    private screenOrientation: ScreenOrientation,
    private network: Network,
    private actionsService: ActionsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const path = window.location.pathname.split('sector/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    console.log("ngOnInit paramIndex", this.paramIndex);

    this.initializeApp();
  }

  initializeApp() {

    this.networkSubject = this.network.onDisconnect().subscribe(() => {
      this.actionsService.presentToastWithOptions("","log-out", 'Vous n\'êtes plus connecté à internet.', "bottom","");
    });
    this.networkSubject = this.network.onConnect().subscribe(() => {
      this.actionsService.presentToastWithOptions("",'log-in',"Vous êtes connecté", "top","",null,10000);
    });

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.platform.ready().then( async () => {
      this.paramIndex = this.appPages.length + 20;
      console.log("initializeApp paramIndex", this.paramIndex);

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // this.firebase.getId().then( id => console.log('id', id));
      // this.firebase.getCurrentUser()
      // .then(user => console.log('user', user))
      // .catch(err => console.log('getcurruser', err));
      
      if (this.platform.is('ios')) {
        this.firebase.grantPermission().then(hasPermission => console.log(hasPermission ? 'granted' : 'denied'));
        this.firebase.onApnsTokenReceived().subscribe(token => {
          this.delivererService.setTokenFcm(token, 'ios').subscribe();
          console.log('PUSH_TOKEN: IOS_TOKEN: ' , token);
        });
      } else {
        this.firebase.onTokenRefresh().subscribe(
          token => {
            this.delivererService.setTokenFcm(token).subscribe();
            console.log(`FCM token refresh: ${token}`);
          },
          error => console.log("error", error)
        );
      }
    });

    this.firebase.onMessageReceived().subscribe(
      data => {
        console.log(`Data onMessageReceived:`, data);
        if(data?.sector) {
          const urlSector = `/sector/${(<string>data.sector).trim().replace(' ','')}`;
          console.log("urlSector", urlSector);

          // this.firebase.clearAllNotifications();
          this.actionsService.presentToastWithOptions("","", 'Commande secteur: ' + urlSector.trim().replace('/',' '), "bottom","",1000);
          this.router.navigate([urlSector]);
        }
      },
      err => console.error("error onMessageReceived", err) 
    );
  }

}
    