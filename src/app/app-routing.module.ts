import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './pages/list/list.module#ListPageModule'
  },
  { 
    path: 'cidade-list', 
    loadChildren: './pages/cidade-list/cidade-list.module#CidadeListPageModule'
  },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'view-post/:id', loadChildren: './pages/view-post/view-post.module#ViewPostPageModule' },
  { path: 'insert-post', loadChildren: './pages/insert-post/insert-post.module#InsertPostPageModule' },
  { path: 'view-comments/:id', loadChildren: './pages/view-comments/view-comments.module#ViewCommentsPageModule' },
  { path: 'teste', loadChildren: './pages/teste/teste.module#TestePageModule' },
  { path: 'favoritos', loadChildren: './pages/favoritos/favoritos.module#FavoritosPageModule' },
  { path: 'minha-conta', loadChildren: './pages/minha-conta/minha-conta.module#MinhaContaPageModule' },
  { path: 'admin', loadChildren: './pages/admin/admin.module#AdminPageModule' },
  { path: 'admin-post-view/:id', loadChildren: './pages/admin-post-view/admin-post-view.module#AdminPostViewPageModule' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
