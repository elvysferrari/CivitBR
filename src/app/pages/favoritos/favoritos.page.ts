import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  posts: Post[] = [];
  auxPosts: Post[] = [];
  user: User;
  constructor(private postService: PostsService,
              private route: Router,
              public loadingController: LoadingController,
              private userService: UserService,
              private ref: ChangeDetectorRef) { }

  async ngOnInit() {
    console.log('ng on init')
    this.userService.getLogged().subscribe(async (user: User) => {
      this.user = user;
    })
    
    if(this.user){
      if(this.user.postFavoritos != undefined){
        if(this.user.postFavoritos.length > 0){
          const loading = await this.loadingController.create({
            message: 'carregando',
            showBackdrop: true
          });
          await loading.present();

          this.postService.getPostFavoritos(this.user.postFavoritos).then(async (data: any[]) => { 
                                       
            this.posts =  data  
            //this.posts = this.posts.filter(p => p.inativo == false);
             
            this.posts.sort((a: any, b: any) => {
              return a.publicadoEm > b.publicadoEm ? -1 : 1;
            });

            await loading.dismiss();
            this.posts.forEach(async (post: Post) => {        
              await this.postService.getPostImages(post.imagens).then((result) => {
                post.imagens = result;
                this.ref.detectChanges();
              })
            })     
          }, async (error) => await loading.dismiss());
        }
      }
    }
  }
  viewPost(post:Post){    
    this.route.navigate(['/view-post', post.id])
  }

}
