import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cidade } from '../models/cidade';


@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private firestore: AngularFirestore) { }

  getCidades() {
    return this.firestore.collection('cidades').snapshotChanges();
  }

  createCidade(cidade: Cidade){
    const cidadeJson = JSON.parse(JSON.stringify(cidade));
    return this.firestore.collection('cidades').add(cidadeJson);
  }

  updateCidade(cidade: Cidade){
    delete cidade.id;
    this.firestore.doc('cidades/' + cidade.id).update(cidade);
  }

  deleteCidade(cidadeId: string){
    this.firestore.doc('cidades/' + cidadeId).delete();
  }
}
