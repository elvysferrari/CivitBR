import { Component, OnInit } from '@angular/core';
import { Cidade } from 'src/app/models/cidade';
import { CidadeService } from 'src/app/services/cidade.service';

@Component({
  selector: 'app-cidade-list',
  templateUrl: './cidade-list.page.html',
  styleUrls: ['./cidade-list.page.scss'],
})
export class CidadeListPage implements OnInit {
  cidades: Cidade[];
  constructor(private cidadeService: CidadeService) { }

  ngOnInit() {
    this.cidadeService.getCidades().subscribe(data => {
      this.cidades = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Cidade;
      })
    })
  }
  create(cidade: Cidade) {
    this.cidadeService.createCidade(cidade);
  }

  update(cidade: Cidade) {
    this.cidadeService.updateCidade(cidade);
  }

  delete(id: string) {
    this.cidadeService.deleteCidade(id);
  }

  tapCidade(cidade: Cidade){
    //this.delete(cidade.id);
    console.log('tapCidade', cidade)
  }
}
