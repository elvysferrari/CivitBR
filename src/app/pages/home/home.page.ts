import { Component } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postsFiltered: any[];
  posts: any[];
  showSearchBar: boolean = false;

  constructor(){}

  ngOnInit(): void {
     
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
}
