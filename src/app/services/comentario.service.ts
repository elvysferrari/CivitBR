import { Comentario } from './../models/comentario';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private firestore: AngularFirestore) { }

  public getComentarios(postId: string) {
    return this.firestore.collection('comentarios', ref => ref.where('postId', '==', postId)).snapshotChanges();

    //this.firestore.collection("comentarios", ref => ref.where('postId', '==', postId)).snapshotChanges()
  }

  addComentario(comentario: Comentario) {
    return new Promise((resolve, reject) => {
      const comentarioJson = JSON.parse(JSON.stringify(comentario));
      this.firestore.collection('comentarios').add(comentarioJson).then((r) => {
        resolve(r);
      }, err => { reject(err) })
    })
  }

  deleteComentario(comentarioId: string) {
    return new Promise((resolve, reject) => {
      this.firestore.doc('comentarios/' + comentarioId).delete().then(() => {
        resolve()
      });
    })
  }
}
