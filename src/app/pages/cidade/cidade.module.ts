import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CidadePage } from './cidade.page';
import { CidadeService } from 'src/app/services/cidade.service';

const routes: Routes = [
  {
    path: '',
    component: CidadePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CidadePage],
  providers:[
    CidadeService
  ]
})
export class CidadePageModule {}
