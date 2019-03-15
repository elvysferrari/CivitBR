import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: AngularFirestore,
    private firestoreStorage: AngularFireStorage) { }

  createPost(post: Post) {
    const postJson = JSON.parse(JSON.stringify(post));
    return this.firestore.collection('posts').add(postJson);
  }

  getPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }
  getPost(id: string) {
    return new Promise((resolve, reject) => {
      this.firestore.collection("posts").doc(id).valueChanges().subscribe((collection) => {
        if (collection) {
          resolve(collection);
        }
      }, err => reject(err))
    })
  }

  getPostImages(ids: string[]) {
    return new Promise<any[]>(async (resolve, reject) => {
      let index = 1;
      let urls: any[] = []
      ids.forEach(async (id) => {
        this.firestoreStorage.ref(id).getDownloadURL().subscribe((value => {
          urls.push({ id: id, url: value })
          if (ids.length == index) {
            resolve(urls)
          } else {
            index++
          }
        }))
      })

    })

  }

  updatePost(post: Post){
    //delete post.id;
    this.firestore.doc('posts/' + post.id).update(post);
  }
}
