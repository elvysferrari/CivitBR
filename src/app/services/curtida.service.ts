import { Curtida } from './../models/curtidas';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CurtidaService {

  constructor(private firestore: AngularFirestore) { }

  public getCurtidas(postId: string){
    return new Promise<Curtida[]>((resolve, reject) => {
      this.firestore.collection("curtidas",ref => ref.where('postId', '==', postId)).snapshotChanges().subscribe((collection) => {     
        let curtidas: Curtida[];
        curtidas = collection.map(e => {        
          return {
            id: e.payload.doc.id,          
            ...e.payload.doc.data()
          } as Curtida;
        }) 
        if(curtidas){
          resolve(curtidas);  
        }
             
      }, err => reject(err))
    })    
  }

  addCurtidas(curtida: Curtida){
    return new Promise((resolve, reject) => {
      const curtidaJson = JSON.parse(JSON.stringify(curtida));
      this.firestore.collection('curtidas').add(curtidaJson).then((r) => {                
        resolve(r);
      }, err => {reject(err)})
    })
  }

  deleteCurtidas(curtidaId: string){
    return new Promise((resolve, reject) => {
      this.firestore.doc('curtidas/' + curtidaId).delete().then(() => {
        resolve()
      });
    })  
  }
}
