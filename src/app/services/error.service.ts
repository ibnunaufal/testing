import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private router: Router,
  ) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // console.log(error.message);

      return throwError("An error occurred: " + error.error.message);
    } else if (error.message == "Timeout has occurred") {
      return throwError("Timeout error, please try again.");
    }
    else if (error.status == 401) {
      // console.log(error.message);
      // if (error.error.message) {
      //   if (error.error.message == 'Expired JWT token') {
      //     console.log(error.error.message);
      //     return throwError("Your Session has timed out, please re-login again.");

      //   }
      // } else {
      return throwError("Username or password has not found.");
      // }

    }
    else {
      if (!environment.production) {
        return throwError(
          "RC: " +
          error.status +
          "<br>" +
          "Path: " +
          error.url +
          "<br>" +
          "Message: " +
          error.error.message
        );


      } else {
        return throwError(error.error.message);
      }
    }
  }
}
