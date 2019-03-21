import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signinUp: FormGroup;
  constructor(public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public userService: UserService,
    private route: Router,
    public toastController: ToastController,) {
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.signinUp = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],      
        password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }
  async onSubmit(){
    let formUser = this.signinUp.value as User;
    formUser.email = formUser.email.trim().toLowerCase();
    formUser.password = formUser.password.trim();
      
    formUser.image = {name: '', url: '', file: '', storagePath: 'assets/images/noavatar.png'}
    const loading = await this.loadingController.create({
      message: 'Cadastrando',
      duration: 2000
    });
    await loading.present();

    if(this.signinUp.valid){
      this.userService.createUser(formUser).then(async (ret) => {
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
