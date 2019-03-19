import { Component, OnInit } from '@angular/core';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/Camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Platform } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { DestinationType } from '@ionic-native/Camera';
/* const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
} */

@Component({
  selector: 'app-teste',
  templateUrl: './teste.page.html',
  styleUrls: ['./teste.page.scss'],
})
export class TestePage implements OnInit {
  imageResponse: any;
  options: any;

  constructor(private imagePicker: ImagePicker,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private webview: WebView,
    private camera: Camera,) { }

  ngOnInit() {
    this.imageResponse = [];
  }
  
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        //this.updateStoredImages(newFileName);  this.base64.encodeFile(newFileName).then((base64file: string) => {
       
        this.imageResponse = []; 
        this.imageResponse.push(success);  
      
                       
    }, error => {
        alert('Error while storing file.');
    });
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: DestinationType.DATA_URL
    };

    this.camera.getPicture(options).then(imagePath => {      
      this.imageResponse.push('data:image/jpeg;base64,' + imagePath);      
    });

  }
  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
}
  openCam(){
    this.takePicture(this.camera.PictureSourceType.CAMERA);
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
      width: 200,
      //height: 200,

      // quality of resized image, defaults to 100
      quality: 25,

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

}
