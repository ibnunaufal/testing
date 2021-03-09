import { Injectable } from '@angular/core';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http : ServiceService) { }

  getMemberTemp(namaPersahaan){
    return this.http.Get_Data_Member("main_d/member_temp/get_member_temp"+ namaPersahaan);
  }
  getMemberTempScroll(start,limit,){
    return this.http.Get_Data_Member("main_d/member_temp/get_member_temp" + start + "&size=" + limit + "&sort=dateTime,desc");
  }

}


