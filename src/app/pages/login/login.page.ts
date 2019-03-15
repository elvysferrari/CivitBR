import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  signinForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public userService: UserService,
    public toastController: ToastController,
    private route: Router,
    ) {
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],      
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {
  
  }
  onSignup(){
    this.route.navigate(['/signup'])    
  }

  onResetPassword(){
    console.log('onResetPassword')
  }

  

  async onSubmit(){
    let formUser = this.signinForm.value as User;
    formUser.email = formUser.email.trim().toLowerCase();
    formUser.password = formUser.password.trim();

    const loading = await this.loadingController.create({
      message: 'Entrando'
    });
    await loading.present();

    if(this.signinForm.valid){
      this.userService.loginUser(formUser).then(async (ret) => {
        await loading.dismiss();
      }).catch( async (err) => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: err,
          position: 'top',
          duration: 2000
        });
        toast.present();
      })
    }


  }

}
