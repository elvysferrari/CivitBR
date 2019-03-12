import { Component, OnInit } from '@angular/core';
import { Cidade } from 'src/app/models/cidade';

@Component({
  selector: 'app-cidade',
  templateUrl: './cidade.page.html',
  styleUrls: ['./cidade.page.scss'],
})
export class CidadePage implements OnInit {
  cidade: Cidade;
  constructor() {
 
  }

  ngOnInit() {
    
  }

  
}
