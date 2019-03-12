import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CidadeListPage } from './cidade-list.page';
import { CidadeService } from 'src/app/services/cidade.service';

const routes: Routes = [
  {
    path: '',
    component: CidadeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CidadeListPage],
  providers:[
    CidadeService
  ]
})
export class CidadeListPageModule {}
