import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ModalController, LoadingController, ToastController,Platform } from '@ionic/angular';
import { HomePage } from '../home/home.page';

import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  FormLogin:FormGroup;
  showPasswordText:any;
  dataLogin:any;

  constructor(
    private formBuilder: FormBuilder, 
    private navCtrl: NavController, 
    public loadingController: LoadingController,
    public modalController: ModalController,
    private platform: Platform,
    public toastController: ToastController,
    private serviceService: ServiceService,
    private router: Router
  ) { 
    var login = localStorage.getItem('token');
    console.log(login);
    // if(login==""){
    //   console.log("blm login");
    // }else{
    //   this.router.navigate(['home']);
    // }
  }

  ngOnInit() {
    //setting form login
    this.FormLogin=this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });
  }

  //fungsi login
  async login(){
    //menampilkan loading
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    //memanggil fungsi loginapi yang berada di service
    this.serviceService.loginApi(this.FormLogin.value,'erp_login/auth/login').subscribe(
      
      data => {
        this.dataLogin=data;
        let message='berhasil login';
          this.presentToast(message);
          // console.log(this.dataLogin);
          this.homepages();
        if(this.dataLogin.status=="error"){
          let message='Nama pengguna dan kata sandi yang Anda masukkan tidak cocok. Silahkan periksa dan coba lagi.';
          this.presentToast(message);
        }
        loading.dismiss();
      },
      error => {
        let message='Tidak ada koneksi internet. Silakan periksa koneksi Anda. Atau karena '+error;
        this.presentToast(message);
        loading.dismiss();
      }
    );
  }

  //menampilkan halaman register
  
  async homepages (){
    this.router.navigate(['home']);
    // const modal = await this.modalController.create({
    //          component: HomePage
    //        })
    //        await modal.present();
    }
  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

}