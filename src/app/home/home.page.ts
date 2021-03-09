import { Component, OnInit,NgZone } from '@angular/core';
import { LoadingController,AlertController,ModalController,ActionSheetController, ToastController } from '@ionic/angular';
import { ServiceService } from '../services/service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {environment} from '../../environments/environment'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {HttpClient}  from '@angular/common/http';
import {LoginPage} from '../login/login.page';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from "@ionic-native/file-path/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Router, UrlHandlingStrategy } from '@angular/router';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
datapelanggan:any;
allMember:any;
DataMember:any=[];
currentImage: any;
input: any=[];
FileURI: any;
FileName: string = "";
show = false;
responsePhoto: any;
profile:any;
img:any;
url:any;
page_number = 1;
page_limit = 10;

tempData:any;
data:any;

  apiUrl = environment.API_URL;
  constructor(
    public loadingController: LoadingController,
    private serviceService: ServiceService,
    private domSanitizer: DomSanitizer, 
    private camera: Camera,
    private http: HttpClient,
    private alertCtrl: AlertController,
    public modalController: ModalController,
    private actionSheetController:ActionSheetController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private transfer: FileTransfer,
    private zone: NgZone,
    private clipboard: Clipboard,
    private router:Router
  ) {
    // this.getImage();
  }

  ngOnInit() {
    //ambil data dari localstorage
    // let dataStorage=JSON.parse(localStorage.getItem(this.serviceService.TOKEN_KEY));
    // this.Username=dataStorage.data.Username;
      // this.GET_DATA_PELANGGAN();

    this.getAllMember(this.page_number,this.page_limit);
  }

  //get data pelanggan
  async GET_DATA_PELANGGAN(){
    await this.serviceService.Get_Data_Pelanggan()
      .subscribe((res:any)=> {
        // console.log(res);
        this.datapelanggan = res;
        console.log(this.datapelanggan);
        
        
      }, err => {
        console.log(err);
      })
  }
  //get data member temp all
  //kendala , ambil id sekolah from home.html to home.page => sebagai parameter 
  async GET_DATA_MEMBER($event){
  var id = $event.detail.value;
  //  var nis = $event.detail.value;
  console.log(id);

  this.serviceService.Get_Data_Member(id).subscribe((res:any)=>
  {
    this.DataMember= res.content
    console.log(this.DataMember)
    
  })
  }
  async getData(id){
  //  var nis = $event.detail.value;
  
    this.serviceService.Get_Data_Member(id).subscribe((res:any)=>
    {
      this.DataMember= res.content
      console.log(this.DataMember)
      
    })
  }

  //get All semua di awal
 getAllMember(page, limit){   
  var data={
  };
  var id = "602a3fe6f8f651b9ed09b47a";//localStorage.getItem('profile');
  // var url = "main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10";
  this.url = "main_base/member_temp/get_by_pelanggan/"+ id +"?page="+page+"&sort=photoUrl&dir=-1&size="+limit;
  //"?page="+this.page_number+"&size="+this.page_limit;

  this.serviceService.GetAllMember(this.url, data).then((res:any)=> {
    //console.log(res);
    this.allMember = res.content;
    console.log(res.content.length); 
  }, err => {
    console.log(err);
  })
 }

  getImgContent(image): SafeUrl {
    var img;
    img = this.apiUrl + 'main_base/image/get/' + image + '/pas';
    return this.domSanitizer.bypassSecurityTrustUrl(img);

  }

  getItems(searchbar) {
    // Reset items back to all of the items
    // set q to the value of the searchbar
    console.log(searchbar);
    var data={
      "search": [
        {
          "field" : "name",
          "key" : searchbar.srcElement.value
        }
      ],  
      "tagSearch": []   
    };
    var id = localStorage.getItem('profile');
    this.url = "main_base/member_temp/get_by_pelanggan/"+ id +"?page="+this.page_number+"&sort=photoUrl&dir=-1&size="+this.page_limit;

    if(searchbar.data){
      this.serviceService.GetAllMember(this.url, data).then((res:any)=> {
        //console.log(res);
        this.allMember = res.content;
        console.log(res.content.length); 
      }, err => {
        console.log(err);
      })
    }else{
      this.getAllMember(this.page_number,this.page_limit);
    }
    
    
    // var q = searchbar.data;
    // // if the value is an empty string don't filter the items
    // if (q.trim() == '') {
    //   return;
    // }
  
    //  this.allMember = this.allMember.filter((v) => {
  
    //   if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
    //      return true;
    //     }
  
    //     return false;
    //   })
  
   }
  
  doRefresh(event) {
    console.log('Begin async operation');
    this.page_number=1;
    this.getAllMember(1,this.page_limit);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  

  loadData(event){
    var data={
      "search": [],  
      "tagSearch": []   
    };
    this.page_number+=1;
    var id = localStorage.getItem('profile');
    // var url = "main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10";
    this.url = "main_base/member_temp/get_by_pelanggan/"+ id +"?page="+this.page_number+"&sort=photoUrl&dir=-1&size="+this.page_limit;
    //"?page="+this.page_number+"&size="+this.page_limit;

    this.serviceService.GetAllMember(this.url,data).then((response:any)=> {
      //console.log(res);
        for (let ii = 0; ii < response.content.length; ii++) {
          this.allMember.push(response.content[ii]);
        }
        if (response.content.length < this.page_limit) {
          event.target.disabled = true;
        } else {
          event.target.complete();
        }
        console.log(this.allMember.length);
    }, err => {
      console.log(err);
    })
  }


// =================================================================================================
  // take picture from camera
   takePicture(item) {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 500,
      targetHeight: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      var data = {
        'file': imageData
      }
    //alert(JSON.stringify(imageData));
    this.serviceService.postBase64(item._id,imageData).then((res)=>{
      this.getAllMember(this.page_number,this.page_limit);
    });
      // setTimeout(() => {
      //   // this.UploadFile(item);
      // }, 1000);
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

  chooseFile(item){
      //get file with cordova file chooser
      this.fileChooser
      .open()
      .then((uri) => {
        //file uri for upload
        this.FileURI = uri;
        this.filePath
          .resolveNativePath(uri) //get file path
          .then((filePath) => {
            this.file.resolveLocalFilesystemUrl(filePath).then(
              (
                fileInfo //get info file
              ) => {
                let files = fileInfo as FileEntry;
                files.file((success) => {
                  this.zone.run(() => {
                    //updating binding file name
                    this.FileName = success.name; //get file name
                    // alert(this.FileName)
                    setTimeout(() => {
                      this.UploadFile(item);
                    }, 1000);
                  });
                });
              },
              (err) => {
                console.log(err);
                throw err;
              }
            );
          });
        this.show = true;
      })
      .catch((e) => console.log(e));
  }
  async presentActionSheet(item) {
    //this.testData(item)
    const actionSheet = await this.actionSheetController.create({
      header: "Change photo profile",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera-outline',
          handler: () => {
            this.takePicture(item);
          }
        },
        {
          text: "Get Photo From Library",
          icon: "image-outline",
          handler: () => {
            this.chooseFile(item);
            
           
          },
        },
        {
          text: "Cancel",
          role: "cancel", // will always sort to be on the bottom
          icon: "close-outline",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }
  uploadChooseFile(item){
    var token = localStorage.getItem('token')
    console.log('token:' + token);
   
      // show loading spinner
      this.loadingController
        .create({
          message: "Uploading.."
        })
        .then(res => {
          res.present();
        });
       
      const fileTransfer: FileTransferObject = this.transfer.create();
      let URL = this.apiUrl + "main_base/image/upload_image";
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.FileName,
        chunkedMode: false,
        mimeType: 'image/jpeg',
        params: { fileName: this.FileName }, // add another parameter (opsional)
        headers: { Authorization: 'Bearer ' + token },
      }
    
    //  alert(JSON.stringify(options));
      fileTransfer.upload(this.FileURI, URL, options)
      .then(
        (data: any) => {
          // this.clipboard.copy(data.response);
          this.data= JSON.parse(data.response)
          // alert(JSON.stringify(this.tempData))
          this.loadingController.dismiss();
         
           console.log(data.response);

          
           this.serviceService.postBase64(item.id_,this.data).then((res) => {
      // alert(this.input.namaSekolah);
             this.getData(this.input.namaSekolah);
             this.FileName=null;
             this.getAllMember(this.page_number, this.page_limit);
            //alert("File uploaded successfully");
          },(error:any)=>{
          // this.clipboard.copy(JSON.stringify(error));
          alert(JSON.stringify(error));
          });
        },(error:any)=>{
          alert(JSON.stringify(error))
        });
        
        
      (err) => {
        alert(err);
        this.loadingController.dismiss();
        // this.clipboard.copy(JSON.stringify(err));
        // this.alertService.alert("Error, Please try again.");
     
      }
  }
  UploadFile(item) {
    // alert(JSON.stringify(item))
    var token = localStorage.getItem('token');
    
    console.log('token:' + token);
   
      // show loading spinner
      this.loadingController
        .create({
          message: "Uploading.."
        })
        .then(res => {
          res.present();
        });
       
      const fileTransfer: FileTransferObject = this.transfer.create();
      let URL = this.apiUrl + "main_base/image/upload_image";
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.FileName,
        chunkedMode: false,
        mimeType: 'image/jpeg',
        params: { fileName: this.FileName }, // add another parameter (opsional)
        headers: { Authorization: 'Bearer ' + token },
      }
    
    //  alert(JSON.stringify(options));
      fileTransfer.upload(this.FileURI, URL, options)
      .then(
        (data: any) => {
          // this.clipboard.copy(data.response);
          this.tempData= JSON.parse(data.response)
          // alert(JSON.stringify(this.tempData))
          this.loadingController.dismiss();
         
           console.log(data.response);

          
           this.serviceService.Put_Data_Member(item._id,this.tempData.name).subscribe((res) => {
      // alert(this.input.namaSekolah);
             this.getData(this.input.namaSekolah);
             this.FileName=null;
             this.getAllMember(this.page_number,this.page_limit);
            //alert("File uploaded successfully");
          },(error:any)=>{
          // this.clipboard.copy(JSON.stringify(error));
          alert(JSON.stringify(error));
          });
        },(error:any)=>{
          alert(JSON.stringify(error))
        });
        
        
      (err) => {
        alert(err);
        this.loadingController.dismiss();
        // this.clipboard.copy(JSON.stringify(err));
        // this.alertService.alert("Error, Please try again.");
     
      }
    }
   
// =================================================================================================

   // function Logout
   async presentLogout() {
    const confirm = await this.alertCtrl.create({
      header: "Konfirmasi",
      message: "Apakah Anda yakin ingin logout?",
      buttons: [
        {
          text: "Batal",
          handler: () => { }
        },
        {
          text: "Logout",
          handler: () => {
            this.confirmLogout();
          }
        }
      ]
    });

    confirm.present();
  }

  confirmLogout() {
    localStorage.clear();
    // this.modalController.dismiss();
 
    this.loginpage();
  }
 
   
  async loginpage (){
    this.router.navigate(['login']);
    // const modal = await this.modalController.create({
    //          component: LoginPage
    //        })
    //        await modal.present();
  }  
}