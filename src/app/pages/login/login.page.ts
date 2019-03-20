import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { LoadingController, AlertController } from '@ionic/angular';
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
    public alertController: AlertController,
  ) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {

  }
  onSignup() {
    this.route.navigate(['/signup'])
  }

  async onResetPassword() {
    const alert = await this.alertController.create({
      header: 'Digite o seu email.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (a) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar',
          handler: async (result) => {            
            this.userService.resetPassword(result.email).then(async (r) => {
              let message: string;
              if(r == true){
                message = "O link para redefinir a senha foi enviado para o seu email."
              }else{                
                message = "Email inválido."                             
              }
              const toast = await this.toastController.create({
                message: message,
                position: 'top',
                duration: 2000
              });
              toast.present();            
            });
           
          }
        }
      ]
    });

    await alert.present();
  }





  lostFocus(evt) {
    evt.srcElement.value = evt.srcElement.value.trim();
  }

  async onSubmit() {
    let formUser = this.signinForm.value as User;
    formUser.email = formUser.email.trim().toLowerCase();
    formUser.password = formUser.password.trim();

    const loading = await this.loadingController.create({
      message: 'Entrando'
    });
    await loading.present();

    if (this.signinForm.valid) {
      this.userService.loginUser(formUser).then(async (ret) => {
        await loading.dismiss();
      }).catch(async (err) => {
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
