import { ComentarioService } from './../../services/comentario.service';
import { Component, OnInit } from '@angular/core';
import { Comentario } from 'src/app/models/comentario';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-view-comments',
  templateUrl: './view-comments.page.html',
  styleUrls: ['./view-comments.page.scss'],
})
export class ViewCommentsPage implements OnInit {
  comments: Comentario[] = [];
  message: string;
  user: User;
  postId: string;

  constructor(private userService: UserService,
    private comentarioService: ComentarioService,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    private postService: PostsService) {

    this.postId = this.route.snapshot.paramMap.get('id');
    
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'carregando',
      showBackdrop: true
    });
    await loading.present();

    if (this.postId) {
      this.comentarioService.getComentarios(this.postId).subscribe(async (data) => {
        this.comments = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Comentario;
        })
        this.comments.sort((a: any, b: any) => {
          return a.dataComentario > b.dataComentario ? -1 : 1;
        });
        await loading.dismiss();
      })
    }

    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;
    })    
  }

  sendComment() {
    let comment = new Comentario();
    comment.comentario = this.message;
    comment.dataComentario = new Date();
    comment.userId = this.user.uid;
    comment.userName = this.user.name;
    comment.postId = this.postId;
    this.comentarioService.addComentario(comment).then(() => {
      this.message = "";
      //get post e somar + 1 comentario
      this.postService.getPost(this.postId).then((post: Post) => {
        console.log(post)
        if(post){
          post.id = this.postId;
          post.totalComentarios =  post.totalComentarios + 1;
          this.postService.updatePost(post);
        }
      })
    }, err => console.log(err))
  }

  deleteComment(commentId: string) {
    this.comentarioService.deleteComentario(commentId).then(() => {
      this.message = "";
    }, err => console.log(err))
  }
}
