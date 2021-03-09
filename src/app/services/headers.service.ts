import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor(private storage: Storage) { }

  getHeaders(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then((token) => {
        let headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        resolve({ headers: headers, observe: 'response' });
      }, reject);
    });
  }
}
