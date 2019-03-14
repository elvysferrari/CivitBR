import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  
  public appPages = [];
  public user: User; 
 
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private route: Router,
    private userService: UserService
  ) {
    this.initializeApp();
    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.auth.afAuth.authState
    .subscribe(
      async (user) => {        
        if (user) {
          this.appPages = this.userService.getPrivatePages();     
          await this.userService.setUserByUid(user.uid);
        }else{
          this.appPages = this.userService.getPublicPages();
        }
        this.route.navigateByUrl("home")
      },
      () => {
        this.route.navigateByUrl("home")
      }
    );
   
  }

  navigateTo(url){
    this.route.navigate([url])
  }
  
}
