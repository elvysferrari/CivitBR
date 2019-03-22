import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userLogged: BehaviorSubject<User>;

  constructor(public authService: AuthService,
    private firestore: AngularFirestore,
    private firestoreStorage: AngularFireStorage) {
    this.userLogged = new BehaviorSubject<User>(undefined);

  }

  public setUserByUid(uid: string) {
    return new Promise((resolve, reject) => {
      this.firestore.collection("users", ref => ref.where('uid', '==', uid)).snapshotChanges().subscribe((collection) => {
        let users: User[];

        users = collection.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as User;
        })

        if (users) {          
          this.login(users[0] as User)
          resolve(users[0]);
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

  getPrivatePages() {
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
        url: '/favoritos',
        icon: 'heart'
      },
      {
        title: 'Minha Conta',
        url: '/minha-conta',
        icon: 'person'
      }]
  }

  getPublicPages() {
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
        title: 'Entrar',
        url: '/login',
        icon: 'person'
      }]
  }
  updateUser(user: User) {
    //delete user.id;
    this.firestore.doc('users/' + user.id).update(user)
    //this.login(user)
  }

  getUserImage(id: string) {
    return new Promise<any>(async (resolve, reject) => {
      this.firestoreStorage.ref(id).getDownloadURL().subscribe((value => {
        resolve(value)      
      }))
    })
  }

  updateUserImage(userId, image){
    return new Promise<boolean>(async (resolve, reject) => {
      this.firestore.doc('usersImages/' + userId + '/image/').update(image).then((r) => {
        alert(r)
        resolve(true)
      }, err => reject(err)).catch((error => {
        reject(error)
      }));
    })
    
  }

  createUserImage(userId, url) {
    let img = {userId: userId, url: url};
    const imgJson = JSON.parse(JSON.stringify(img));
    this.firestore.collection('userimages').add(imgJson);
    this.userLogged.subscribe((user) => {
      user.image = url;
    })
  }
}
