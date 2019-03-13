import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { BaseService } from '../services/base.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService {

  constructor(public afAuth: AngularFireAuth){
    super();
  }

  signinWithEmail(user: {email: string, password: string}) : Promise<any>{
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then((response =>{
      return response != null;
    })

    ).catch(this.handlePromiseError);
  }

  logOut(): Promise<void>{
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string){
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }

  createAuthUser(user: {email: string, password: string}) : Promise<any>{
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).catch(this.handlePromiseError);
  }

  get authenticated(): Promise<boolean>
  {
    return new Promise((resolve, reject) => {
      this.afAuth.authState      
      .subscribe((authState) =>{        
        (authState) ? resolve(true) : reject(false);        
      })
    }).catch(this.handlePromiseError)
  }
}
