import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { from, Observable, ReplaySubject } from 'rxjs';
import { Platform, ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { ErrorService } from "./error.service";
//import { Storage } from "@ionic/storage";




const httpOptions = { 
  headers: new  HttpHeaders({ 'Content-Type' : 'application/json'})
    }
@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  DataLogin:any;
  DataCheckLogin:any;
  authenticationState = new ReplaySubject();
  token:any;
  url: string;
  itemListData = [];
  
  TOKEN_KEY = 'token';

  constructor(
    private http: HttpClient, 
    private platform: Platform,
    public toastController: ToastController,
    private error: ErrorService,
    //public storage: Storage,
    
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });

   }

  //ika token tidak ada maka authenticationState=false
  //jika token ada maka akan memanggil fungsi cekUser 
  checkToken() {
    if(localStorage.getItem('token')==null || localStorage.getItem('token')=='') {
      this.authenticationState.next(false);     
    }else{
      this.CekUser().subscribe(data => {
        this.DataCheckLogin=data;
        if(this.DataCheckLogin.status=="success"){
          this.authenticationState.next(true);          
        }else{
          this.authenticationState.next(false);
        }
     },
     err => {
        this.authenticationState.next(false);
      });
    }                                                                                                      
  }

  //cek user di sisi server dengan headers authorize bearer
  //teman-teman dapat membuat fungsi baru untuk request data lainnya dengan header authorize bearer
  CekUser(){
    //ambil data dari localstorage
    let dataStorage=localStorage.getItem('token') ? localStorage.getItem('token')  :'';
     this.token=dataStorage;    
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+this.token
      });   
    return this.http.get(environment.API_URL + 'api/user/'+dataStorage, { headers: headers }).pipe(
      timeout(8000),
      tap(Data => {
        return Data;
      })
    );
  }

  //login
  loginApi(credentials, type){  
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    // console.log(environment.API_URL + type);

    return this.http.post(environment.API_URL + type, `username=${credentials.username}&password=${credentials.password}`, { headers: headers }).pipe(
      tap((Data:any) => {
        console.log(Data);
        
        this.DataLogin=Data;
        if(this.DataLogin){ 
          // this.storage.set('token',JSON.stringify(Data))
          localStorage.setItem('token',Data.access_token);
          localStorage.setItem('profile',Data.active_company.id);
          this.authenticationState.next(true);
          // console.log(this.storage)
        }else{
          this.authenticationState.next(false);
        }
        return Data;
        
      })
    );
  }
  private extracData(res: Response){
    let body = res;
    return body || {};
  }

  //get_data_pelanggan
  Get_Data_Pelanggan():Observable<any> {
    var token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+token
    });  

      return this.http.get(environment.API_URL+'main_base/pelanggan/get_combo_pelanggan', {headers: headers} ).pipe(
        map(this.extracData),
        
      )
  }

  Get_Data_Member(urlMember){
    var data={
      "search": [
        {
          "field" : "customerId",
          "key" : urlMember
        }
      ],  
      "tagSearch": []   
    };
    var token = localStorage.getItem('token');
   
    const header = new HttpHeaders({
      'Content-Type': 'application/json',  
      'Authorization': "Bearer "+token,

    });   
      return this.http.post(environment.API_URL+ 'main_base/member_temp/member_temp' + 
      "?sort=name,asc&size=20" 
      , data,{headers: header}).pipe(
        tap((Data:any) => {
          return Data;
        })
      )
  }

  GetAllMember(url, data){
    var adata = {
      "search": [
        // {
        //   "field": field,
        //   "key": key
        // }
      ]
    }
    console.log(data);
    var token = localStorage.getItem('token');
    // var url = "main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10";
    // var url = "main_base/member_temp/get_by_pelanggan/";
    let header = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
    return new Promise((resolve, reject) => {
      this.http
          .post(environment.API_URL + url , data, {headers: header})
          .pipe(
            timeout(environment.TIMEOUT),
            catchError(this.error.handleError)
          )
          .subscribe((response: any) => {
            console.log(response.content);
            localStorage.setItem('allMember',response);
            resolve(response);

          }, reject);
      });
    //   this.header.getHeaders().then((headers) => {
        
    // });
    
    // // console.log(token);
     
    // //main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10"
    // return this.http.post(environment.API_URL+ "main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10" 
    //   , data,{headers: header}).pipe(
    //     tap((Data:any) => {
    //       return Data;
    //     },)
    //   )
    // return this.http.post(environment.API_URL+
    //   "main_base/member_temp/get_all_memberTemp?page=0&sort=updateTime&dir=-1&size=10", data,
    //   {header: headers})
  }

  postBase64(_id,data){
    var token = localStorage.getItem('token');

    var coba = {
      "idMemberTemp": _id,
      "filename": "string",
      "base64text": data
    };
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Bearer "+token,

    });   
    // alert(JSON.stringify(header))
    console.log(header);
    console.log(data);
    
    return new Promise((resolve, reject) => {
      this.http
          .post(environment.API_URL + 'main_base/member_image/upload_base64_pasphoto', coba, {headers: header})
          .pipe(
            timeout(environment.TIMEOUT),
            catchError(this.error.handleError)
          )
          .subscribe((response: any) => {
            console.log(data);
            
            console.log(response.content);
            // localStorage.setItem('allMember',response);
            resolve(response);

          }, reject);
      });
      // return this.http.post(environment.API_URL+ 'main_base/member_image/upload_base64_pasphoto/'+_id +'?data=' +data 
      // ,{headers: header}).pipe(
      //   tap((Data:any) => {
      //     return Data;
        
      //   })
      // )
  }

  Put_Data_Member( id,photoUrl){
    
    var token = localStorage.getItem('token');
   
    const header = new HttpHeaders({
      'Content-Type': 'application/json',  
      'Authorization': "Bearer "+token,
    });   
    // alert(JSON.stringify(header))
      return this.http.put(environment.API_URL+ 'main_base/member_temp/member_temp_image?id_='+ id +'&image=' + photoUrl 
      ,'',{headers: header}).pipe(
        tap((Data:any) => {
          return Data;
        })
      )
  }
  
 


  //logout
  logout() {
    this.authenticationState.next(false);
  }
}