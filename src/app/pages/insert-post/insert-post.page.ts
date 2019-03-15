import { PostsService } from './../../services/posts.service';
import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController) {

      this.postForm = this.formBuilder.group({
        titulo: ['',  [Validators.required, Validators.minLength(6)]],      
        descricao: ['', [Validators.required, Validators.maxLength(250)]],
        categoria:['', [Validators.required, Validators.minLength(1)]],
        cidade:['', [Validators.required, Validators.minLength(1)]],
      });
  }


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
            console.log(a)
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
      this.postService.createPost(formPost).then((ret) => {
       console.log('ret', ret)
      }).catch( async (err) => {
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

