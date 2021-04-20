import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public paramIndex = 0;
  public userName = "hi@ionicframework.com";
  public appPages = [
    {
      title: 'Vue Gloable',
      url: '/overview',
      icon: 'eye',
      // icon: 'mail'
    },
    {
      title: 'Commandes en cours',
      url: '/pending-orders',
      icon: 'bicycle'
      // icon: 'paper-plane'
    },
    {
      title: 'Commandes disponibles',
      url: '/available-orders',
      icon: 'flash',
      // icon: 'notifications-circle'
    },
    {
      title: 'Commandes livrées',
      url: '/delivered-orders',
      // url: '/folder/delivered-orders',
      icon: 'checkmark-done',
      // icon: 'heart'
    },
    // {
    //   title: 'Trash',
    //   url: '/folder/Trash',
    //   icon: 'trash'
    // },
  ];
  public indexParams = this.appPages.length+1;
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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.paramIndex = this.appPages.length;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
