import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: AngularFirestore) { }

  createPost(post: Post){
    const postJson = JSON.parse(JSON.stringify(post));
    return this.firestore.collection('posts').add(postJson);
  }

  getPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }
}
