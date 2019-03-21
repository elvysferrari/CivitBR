import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { LoadingController, AlertController, ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Camera, PictureSourceType, CameraOptions, DestinationType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.page.html',
  styleUrls: ['./minha-conta.page.scss'],
})
export class MinhaContaPage implements OnInit {
  user: User;
  options: any;
  refDB: any;
  task: any;
  uploadProgress: number = 0;

  constructor(    
    private afStorage: AngularFireStorage,
    private userService: UserService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: Router,
    public toastController: ToastController,
    private imagePicker: ImagePicker,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private camera: Camera,
    private webview: WebView,
    public actionSheetController: ActionSheetController,
    private ref: ChangeDetectorRef) {}

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

  async selectPhotoType() {
    
      const actionSheet = await this.actionSheetController.create({
        header: 'Escolha as imagens',
        buttons: [{
          text: 'Tirar Foto',
          icon: 'camera',
          handler: () => {
            this.openCam()
          }
        }, {
          text: 'Galeria',
          icon: 'images',
          handler: () => {
            this.getImages();
          }
        }, {
          text: 'Fechar',
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }]
      });
      await actionSheet.present();
    }

    pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        let converted = this.webview.convertFileSrc(img);
        return converted;
      }
    }

    copyFileToLocalDir(namePath, currentName, newFileName) {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        let filePath = this.file.dataDirectory + newFileName;
        let resPath = this.pathForImage(filePath);

        let img = new ImgModel()
        img.file = filePath;
        img.url = resPath;
        img.name = newFileName

        this.user.image = img;        
        this.ref.detectChanges();

        this.uploadFirebase();
      }, error => {
        
      });
    }

    takePicture(sourceType: PictureSourceType) {
      var options: CameraOptions = {
        quality: 60,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: DestinationType.FILE_URL
      };
  
  
      this.camera.getPicture(options).then(imagePath => {
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
  
      });
  
    }

    createFileName() {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
      return newFileName;
    }

    openCam() {
      this.takePicture(this.camera.PictureSourceType.CAMERA);
    }

    getImages() {
      this.options = {
        // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: 1,
  
        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        width: 480,
        
        //height: 200,
  
        // quality of resized image, defaults to 100
        quality: 60,
  
        // output type, defaults to FILE_URIs.
        // available options are 
        // window.imagePicker.OutputType.FILE_URI (0) or 
        // window.imagePicker.OutputType.BASE64_STRING (1)
        outputType: 0
      };
  
      this.imagePicker.getPictures(this.options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          var currentName = results[i].substr(results[i].lastIndexOf('/') + 1);
          var correctPath = results[i].substr(0, results[i].lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }, (err) => {
        
      });
    }


    readFile(file: any) {
      return new Promise<Blob>(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgBlob = new Blob([reader.result], {
            type: file.type
          });
          resolve(imgBlob)
        };
        reader.readAsArrayBuffer(file);
      })
  
    }

    startUpload(imgEntry) {
      return new Promise<Blob>(async (resolve, reject) => {
        this.file.resolveLocalFilesystemUrl(imgEntry.file)
          .then(entry => {
            (<FileEntry>entry).file(file => this.readFile(file).then((blob) => {
              resolve(blob)
            }))
          })
          .catch(err => {
            reject(undefined)
          });
      })
  
    }

    async uploadFirebase() {
      return new Promise<boolean>(async (resolve, reject) => {
      
        if (this.user.image != undefined) {
          

          await this.startUpload(this.user.image).then(async (imageFile: Blob) => {
            const randomId = Math.random().toString(36).substring(2);
            const loading = await this.loadingController.create({
              message: 'salvando',
              showBackdrop: true
            });
            await loading.present();

            this.refDB = this.afStorage.ref(randomId);
            
            this.refDB.put(imageFile);     
            
            setTimeout(() => {
              this.userService.getUserImage(randomId).then(async (url) =>{
                this.user.image.storagePath = url;
                
                this.userService.updateUser(this.user);
                await loading.dismiss();
                
                const toast = await this.toastController.create({
                  message: "Foto salva",
                  position: 'top',
                  duration: 2000
                });
                toast.present();
              })    
            }, 4000)
                                
          });
        }            
      })
    }
}
export class ImgModel {
  url: string;
  name: string;
  file: string;
  storagePath: string;
}
