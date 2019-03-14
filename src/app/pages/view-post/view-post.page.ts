import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.page.html',
  styleUrls: ['./view-post.page.scss'],
})
export class ViewPostPage implements OnInit {
  postId: string;
  post: Post;
  postUrlImages: string[] =[]
  slideOpts = {
    effect: 'flip'
  };

  constructor(private route: ActivatedRoute,
              private postService: PostsService) { 
    this.postId = this.route.snapshot.paramMap.get('id');
    if(this.postId){
      postService.getPost(this.postId).then((post: Post) => {
        this.post = post;
        this.postService.getPostImages(post.imagens).then((result) => {
          this.postUrlImages = result;
        })
        
      })
    }
  }

  ngOnInit() {
  }

  clickIconHeart(){

  }
}
