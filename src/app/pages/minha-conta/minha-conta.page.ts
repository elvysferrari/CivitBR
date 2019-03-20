import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


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
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: Router,
    public toastController: ToastController) {}

  ngOnInit() {
    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;      
    })
  }

  onSubmit(){

  }

  async redefinirSenha(){
    await this.userService.resetPassword(this.user.email);
    const toast = await this.toastController.create({
      message: "O link para redefinir a senha foi enviado para o seu email.",
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async logout(){
    const alert = await this.alertController.create({
      header: 'Sair da conta',
      message: 'Tem certeza que deseja sair?',
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
            this.userService.logout();
            this.route.navigate(['/home'])
          }
        }
      ]
    });

    await alert.present();

    
  }
}
