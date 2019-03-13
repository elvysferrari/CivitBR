import { Person } from './../models/person';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  person: Person;  

  constructor(private db: AngularFirestore) { 
    this.person = new Person();
  }

  addPessoa(pessoa: Person){

      let promise = new Promise<Person>((resolve, reject) => {
        const pessoaJson = JSON.parse(JSON.stringify(pessoa));
        this.db.collection('pessoas').add(pessoaJson).then((resultAdd)=>{   
          console.log('resultAdd', resultAdd)                 
          resolve(pessoa)          
        }).catch(error => reject(false));  
      })
      return promise;
  }

  getByUserUid(uid: string): Promise<Person>{
    let promise = new Promise<Person>((resolve, reject) => {

        /* let onQueryEvent = function(result) {
            if (!result.error) {
                let index = 1;
                let keys = Object.keys(result["value"])
                let returnPessoa: Pessoa; 
                keys.forEach((key) => {
                  let pessoa = result["value"][key]            
                  if(pessoa){
                    pessoa.index = (index -1)
                    returnPessoa = pessoa;
                  }
                  //
                  if(index == keys.length){              
                    resolve(returnPessoa)
                  }else{
                    index++;
                  }
                })
            }else{
                reject(result.error)
            }
        }; */
    
        /* firebase.query(
            onQueryEvent,
            "/pessoas",
            {                    
                singleEvent: true,                 
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'userUid' // mandatory when type is 'child'
                },
                range: {
                   type: firebase.QueryRangeType.EQUAL_TO,
                   value: uid
                },
                limit: {
                    type: firebase.QueryLimitType.LAST,
                    value: 1
                }
            }
        ); */
      })
  
      return promise;
  }
}
