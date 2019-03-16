import { PostsService } from './../../services/posts.service';
import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/Camera';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx'
@Component({
  selector: 'app-insert-post',
  templateUrl: './insert-post.page.html',
  styleUrls: ['./insert-post.page.scss'],
})
export class InsertPostPage implements OnInit {
  postForm: FormGroup;
  user: User;

  constructor(private afStorage: AngularFireStorage,
    private _sanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostsService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private route: Router,
    private imagePicker: ImagePicker,
    private file: File,
    private filePath: FilePath,
    private platform: Platform) {

      this.postForm = this.formBuilder.group({
        titulo: ['',  [Validators.required, Validators.minLength(6)]],      
        descricao: ['', [Validators.required, Validators.minLength(5)]],
        localizacao: ['', [Validators.required, Validators.minLength(5)]],
        categoria:['', [Validators.required, Validators.minLength(1)]],
        cidade:['', [Validators.required, Validators.minLength(1)]],
      });
  }
  
  imageResponse: any = [];;
  options: any;

  ref: any;
  task: any;
  uploadProgress: number = 0;
  files: any[] = [];
  filePaths: string[] = [];
  post: Post;
  filesTranferreds: string[] = [];
  images: ImgModel[] = [{
      id: 0,
      name: "",
      url: "",
      file: undefined
    },
    {
      id: 1,
      name: "",
      url: "",
      file: undefined
    },
    {
      id: 2,
      name: "",
      url: "",
      file: undefined
    },
    {
      id: 3,
      name: "",
      url: "",
      file: undefined
    },
    {
      id: 4,
      name: "",
      url: "",
      file: undefined
    }
  ];

  openCam(){
    document.addEventListener('deviceready', () => {
      Camera.getPicture()
        .then((data) => {
          if (this.platform.is('android')) {
            this.filePath.resolveNativePath(data).then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = data.substring(data.lastIndexOf('/') + 1, data.lastIndexOf('?'));
              
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
          }else{
            var currentName = data.substr(data.lastIndexOf('/') + 1);
            var correctPath = data.substr(0, data.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
          

          //this.imageResponse.push( data);
        })
        .catch((e) => console.log('Error occurred while taking a picture', e));
    });

  }
  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
        alert('createFileName'+ newFileName)
    return newFileName;
}
 
copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        //this.updateStoredImages(newFileName);
        alert(newFileName)
        this.imageResponse.push('data:image/jpeg;base64,' + newFileName);
    }, error => {
      alert('Error while storing file.');
    });
}
  getImages() {
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      //maximumImagesCount: 3,
 
      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 480,
      //height: 200,
 
      // quality of resized image, defaults to 100
      quality: 80,
 
      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => {
      alert(err);
    });
  }
  ngOnInit() {
    this.userService.getLogged().subscribe((user: User) => {
      this.user = user;
    })
  }

  upload(event, id) {
    let src = URL.createObjectURL(event.target.files[0])
    this.images[id].url = src;
    this.images[id].file = event.target.files[0]
  }

  async uploadFirebase() {
    return new Promise<boolean>(async (resolve, reject) => {
      
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i].file != undefined) {
          const randomId = Math.random().toString(36).substring(2);
          this.filePaths.push(randomId);
          this.ref = this.afStorage.ref(randomId);
          this.task = this.ref.put(this.images[i].file);
          await this.task.snapshotChanges().subscribe(a => {
            if (a.bytesTransferred == a.totalBytes) {
              this.filesTranferreds.push(a.ref.fullPath)
            }
            this.images[i]["progress"] = (a.bytesTransferred / a.totalBytes) * 100;
            this.uploadProgress = (a.bytesTransferred / a.totalBytes) * 100;
  
            if(this.uploadProgress == 100){
              resolve(true)
            }
          });
        }
      }
    })
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustUrl(`${image}`);
  }

  async onSubmit(){
    const loading = await this.loadingController.create({
      message: 'salvando',
      showBackdrop: true
    });
    await loading.present();

    await this.uploadFirebase();
    
    let formPost = this.postForm.value as Post;
    formPost.totalComentarios = 0;
    formPost.totalCurtidas = 0;
    formPost.imagens = this.filePaths;
    formPost.inativo = false;
    formPost.publicadoEm = new Date();
    formPost.status = "Aguardando aprovação"
    formPost.userName = this.user.name;
    formPost.userUid = this.user.uid;
    
    if(this.postForm.valid){
      this.postService.createPost(formPost).then(async (ret) => {
        await loading.dismiss();
        this.route.navigate(['/home'])
      }).catch( async (err) => {
        await loading.dismiss();
        this.route.navigate(['/home'])
        
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

export class ImgModel {
  id: number;
  url: string
  name: string
  file: any;
}

