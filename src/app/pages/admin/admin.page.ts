import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {


  posts: Post[] = [];
  showSearchBar: boolean = false;
  user: User;

  filterPosts: string = 'all';
  constructor(private postService: PostsService,
    private route: Router,
    public loadingController: LoadingController,
    public userService: UserService,
    public toastController: ToastController,
    public alertController: AlertController) { }

  async ngOnInit() {

    const loading = await this.loadingController.create({
      message: 'carregando',
      showBackdrop: true
    });
    await loading.present();

    this.postService.getPosts().subscribe(async (data) => {
      this.posts = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Post;
      });
      await loading.dismiss();
      
      this.posts.sort((a: any, b: any) => {
        return a.publicadoEm > b.publicadoEm ? -1 : 1;
      });     

    })

    this.userService.getLogged().subscribe(async (user: User) => {
      this.user = user;
    })
  }

  async clickFilterPosts(filter: string) {
    

  }


  viewPost(post: Post) {
    this.route.navigate(['/admin-post-view', post.id])
  }

  async deletePost(post: Post) {
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

  changeStatus(post: Post){
    if(post.status == "Aprovado"){
      post.status = "Aguardando aprovação";
    }else if(post.status == "Aguardando aprovação"){
      post.status = "Aprovado"
    }
    this.postService.updatePost(post);    
  }
}
