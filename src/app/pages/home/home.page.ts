import { Post } from './../../models/post';
import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postsFiltered: any[];
  posts: Post[] = [];
  showSearchBar: boolean = false;

  constructor(private postService: PostsService){}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(data => {      
      this.posts = data.map(e => {        
        return {
          id: e.payload.doc.id,          
          ...e.payload.doc.data()
        } as Post;
      })
      
    })
    
  }
  changeSearch(evt) {
    if (evt.detail.value == "") {
      this.postsFiltered = this.posts;
    } else {
      this.postsFiltered = this.posts.filter(x => x.titulo.toLocaleLowerCase().includes(evt.detail.value.toLocaleLowerCase()));
    }
    console.log('post', this.posts)
  }

  cancelSearch(evt) {
    this.postsFiltered = this.posts;
    this.showSearchBar = false;
  }

  clickIconSearchBar(){
    this.showSearchBar = !this.showSearchBar
  }
}
