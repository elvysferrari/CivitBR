import { ComentarioService } from './../../services/comentario.service';
import { CurtidaService } from './../../services/curtida.service';
import { Comentario } from './../../models/comentario';
import { User } from 'src/app/models/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { Curtida } from 'src/app/models/curtidas';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.page.html',
  styleUrls: ['./view-post.page.scss'],
})
export class ViewPostPage implements OnInit {
  postId: string;
  post: Post;
  postUrlImages: any[] = []
  postComentarios: Comentario[] = [];
  postCurtidas: Curtida[] = [];

  curtiu: Curtida;
  heartColor: string = 'dark'
  slideOpts = {
    effect: 'flip'
  };

  user: User;
  enableIconHeart: boolean = true;

  constructor(private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private curtidaService: CurtidaService,
    private comentarioService: ComentarioService,
    private router: Router,
    public loadingController: LoadingController) {
    this.postId = this.route.snapshot.paramMap.get('id');
    
    
    
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'carregando',
      showBackdrop: true
    });
    await loading.present();

    if (this.postId) {       
      this.postService.getPost(this.postId).then(async (post: Post) => {
        this.post = post;
        this.post.id = this.postId;

        this.postService.getPostImages(post.imagens).then((result) => {
          this.postUrlImages = result;
        })
        await loading.dismiss();
        this.curtidaService.getCurtidas(this.postId).then((result) => {
          this.postCurtidas = result;        
          if (this.postCurtidas != undefined) {
            this.post.totalCurtidas = this.postCurtidas.length;
            this.curtiu = this.postCurtidas.find(x => x.userId == this.user.uid);
            if (this.curtiu != undefined) {
              this.heartColor = 'primary'
            }
          }          
        })
      })
    }

    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;
    })
  }

  clickIconHeart() {
    if(this.enableIconHeart){
      this.enableIconHeart = false;
      if (this.user == undefined) {
        this.router.navigate(['/login'])
      } else {
        if (this.curtiu == undefined) {
          let curtida = new Curtida();
          curtida.postId = this.postId;
          curtida.userId = this.user.uid;
          this.curtidaService.addCurtidas(curtida).then((result) => {
            this.curtiu = new Curtida();
            this.curtiu.id = result['id']
            this.curtiu.postId = this.postId;
            this.curtiu.userId = this.user.uid;
            this.heartColor = 'primary'
            this.post.totalCurtidas = this.post.totalCurtidas + 1;
            this.enableIconHeart = true;
          })
        } else {
          this.curtidaService.deleteCurtidas(this.curtiu.id).then(() => {
            this.curtiu = undefined;
            this.heartColor = 'dark'
            this.post.totalCurtidas = this.post.totalCurtidas - 1;
            this.enableIconHeart = true;
          })
        }
      }
    }
    

  }
  clickFavorito(){
    if (this.user == undefined) {
      this.router.navigate(['/login'])
    }else{
      if(this.user.postFavoritos == undefined){
        this.user.postFavoritos = [];
      }
      let exist = this.user.postFavoritos.find(x => x == this.postId)
      if(!exist){
        this.user.postFavoritos.push(this.postId);        
      }else{
        this.user.postFavoritos.splice(this.user.postFavoritos.indexOf(exist), 1);
      }
            
      this.userService.updateUserFavoritos(this.user, this.user.postFavoritos);
    }
  }
  clickComentarios() {
    if (this.user == undefined) {
      this.router.navigate(['/login'])
    }else{
      this.router.navigate(['/view-comments', this.postId])
    }
  }
}
