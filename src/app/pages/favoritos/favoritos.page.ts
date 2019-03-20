import { Component, OnInit } from '@angular/core';
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
  user: User;
  constructor(private postService: PostsService,
              private route: Router,
              public loadingController: LoadingController,
              private userService: UserService) { }

  async ngOnInit() {
    this.userService.getLogged().subscribe(async (user: User) => {
      this.user = user;

      const loading = await this.loadingController.create({
        message: 'carregando',
        showBackdrop: true
      });
      await loading.present();
  

      if(this.user.postFavoritos != undefined){
        if(this.user.postFavoritos.length > 0){
          this.postService.getPostFavoritos(this.user.postFavoritos).then(async (data: any[]) => {      
            this.posts = data;
            await loading.dismiss();
      
            this.posts.sort((a: any, b: any) => {
              return a.publicadoEm > b.publicadoEm ? -1 : 1;
            });
            
            this.posts.forEach(async (post: Post) => {        
              await this.postService.getPostImages(post.imagens).then((result) => {
                post.imagens = result;
              })
            })     
          }, async (error) => await loading.dismiss());
        }
        else{
          await loading.dismiss();
        }
      }  else{
        await loading.dismiss();
      }  
    })
    
  }
  viewPost(post:Post){    
    this.route.navigate(['/view-post', post.id])
  }

}
