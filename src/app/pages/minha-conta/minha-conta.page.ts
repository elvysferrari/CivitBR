import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.page.html',
  styleUrls: ['./minha-conta.page.scss'],
})
export class MinhaContaPage implements OnInit {
  user: User;
  
  constructor(
    private afStorage: AngularFireStorage,
    private userService: UserService,
    public loadingController: LoadingController) {}

  ngOnInit() {
    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;      
    })
  }

}
