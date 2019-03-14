import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userLogged: BehaviorSubject<User>;

  constructor(public authService: AuthService, 
              private firestore: AngularFirestore) {
    this.userLogged = new BehaviorSubject<User>(undefined);

  }

  public setUserByUid(uid: string){
    return new Promise((resolve, reject) => {
      this.firestore.collection("users",ref => ref.where('uid', '==', uid)).valueChanges().subscribe((collection) => {     
        if(collection){        
          this.login(collection[0] as User)     
          resolve(collection[0]);   
        }      
      }, err => reject(err))
    })
    
  }

  public getLogged(): Observable<User> {
    return this.userLogged.asObservable();
  }

  loginUser(loginUser: User) {
    return new Promise((resolve, reject) => {
      this.authService.signinWithEmail(
        {
          email: loginUser.email,
          password: loginUser.password
        })
        .then(user => {          
          this.login(loginUser);
          resolve(user);
        })
        .catch(error => {
          reject(error)
        });
    });
  }

  async logout() {
    await this.authService.logOut();
    this.login(undefined);

  }

  public login(user: User) {
    this.userLogged.next(user);
  }

  createUser(userCreate: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.authService.createAuthUser(
        {
          email: userCreate.email,
          password: userCreate.password
        })
        .then(resp => {
          
          userCreate.uid = resp.user.uid;
          const userJson = JSON.parse(JSON.stringify(userCreate));
          this.firestore.collection('users').add(userJson);

          this.login(userCreate);
          resolve(userCreate);
        })
        .catch(error => {
          reject(error)
        });
    });
  }

  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      this.authService.resetPassword(
        email
      ).then(() => {
        resolve(true)
      },
        function (errorMessage) {
          resolve(errorMessage)
        }
      );
    });
  }

  getPrivatePages(){
    return [
     {
      title: 'Postagens',
      url: '/home',
      icon: 'paper'
    },
    {
      title: 'Inserir Postagem',
      url: '/insert-post',
      icon: 'create'
    },    
    {
      title: 'Favoritos',
      url: '/cidade-list',
      icon: 'heart'
    },
    {
      title: 'Minha Conta',
      url: '/cidade-list',
      icon: 'person'
    }]
  }

  getPublicPages(){
    return [
     {
      title: 'Postagens',
      url: '/home',
      icon: 'paper'
    },
    {
      title: 'Entrar',
      url: '/login',
      icon: 'person'
    }]
  }

}
