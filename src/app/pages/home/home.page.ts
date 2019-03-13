import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: User;
  constructor(private userService: UserService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    /*  let user = new User;
    user.email = 'elvys.ferrari@gmail.com'
    user.name = 'Elvys Ferrari'
    user.password = '123456'
    this.userService.createUser(user).then((result) => {
      console.log('Home', result)
    })  */
    /* let user= new User();
    user.email = "elvys.ferrari@gmail.com"
    user.password = '123456'
    this.userService.loginUser(user).then((resp) => {
      console.log('Home', resp)
    })

    this.userService.getLogged().subscribe((user)=>{
      console.log('logou', user)
    }) */
    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;
    })
  }
}
