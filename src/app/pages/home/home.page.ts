import { UserService } from 'src/app/services/user.service';
import { Post } from './../../models/post';
import { Component } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postsFiltered: any[];
  posts: Post[] = [];
  showSearchBar: boolean = false;
  user: User;

  filterPosts: string = 'all';
  constructor(private postService: PostsService,
              private route: Router,
              public loadingController: LoadingController,
              public userService: UserService,
              public toastController: ToastController,
              public alertController: AlertController){}

  
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'carregando',
      showBackdrop: true
    });
    await loading.present();

    this.postService.getPosts().subscribe(async (data) => {      
      this.postsFiltered = data.map(e => {        
        return {
          id: e.payload.doc.id,          
          ...e.payload.doc.data()
        } as Post;
      }).filter(x => x.inativo == false);  
      await loading.dismiss();

      this.postsFiltered.sort((a: any, b: any) => {
        return a.publicadoEm > b.publicadoEm ? -1 : 1;
      });
      
      this.postsFiltered.forEach(async (post: Post) => {        
        await this.postService.getPostImages(post.imagens).then((result) => {
          post.imagens = result;
        })
      }) 
      this.posts = this.postsFiltered
    }) 
    this.userService.getLogged().subscribe(async (user: User) => {
      this.user = user;
    })   
  }

  async clickFilterPosts(filter: string){
    if(this.filterPosts != filter){
      if(filter=="all"){
        this.postsFiltered = this.posts;
        this.filterPosts = filter;
      }else{
        if(this.user){
          this.postsFiltered = this.posts.filter(x => x.userUid == this.user.uid);
          this.filterPosts = filter;
        }else{
          const toast = await this.toastController.create({
            message: "Você precisar entrar para ver suas postagens.",
            position: 'top',
            duration: 3000
          });
          toast.present();
        }
        
      }
    }
    
  }
  changeSearch(evt) {
    if (evt.detail.value == "") {
      this.postsFiltered = this.posts;
    } else {
      this.postsFiltered = this.posts.filter(x => x.titulo.toLocaleLowerCase().includes(evt.detail.value.toLocaleLowerCase()));
    }
  }

  cancelSearch(evt) {
    this.postsFiltered = this.posts;
    this.showSearchBar = false;
  }

  clickIconSearchBar(){
    this.showSearchBar = !this.showSearchBar
  }

  viewPost(post:Post){
    this.route.navigate(['/view-post', post.id])
  }

  async deletePost(post:Post){
    const alert = await this.alertController.create({
      header: 'Excluir postagem',
      message: 'Tem certeza que deseja excluir?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Sim',
          handler: () => {
            post.inativo = true;
            this.postService.updatePost(post)
          }
        }
      ]
    });

    await alert.present();

  }
}
