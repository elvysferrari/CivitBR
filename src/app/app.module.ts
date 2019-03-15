import { UserService } from './services/user.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';

import { AuthService } from './services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { PersonService } from './services/person.service';
import { AuthGuard } from './guards/auth.guard';
import { PostsService } from './services/posts.service';
import { CurtidaService } from './services/curtida.service';
import { ComentarioService } from './services/comentario.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    CurtidaService,
    ComentarioService,
    PostsService,
    AuthGuard,
    UserService,
    AuthService,
    AngularFireAuth,
    PersonService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
