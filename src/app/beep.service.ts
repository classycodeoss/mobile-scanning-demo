import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BeepService {

  constructor(public http: HttpClient) {
  }

  beep() {
    const audio = new Audio();
    audio.src = 'assets/beep.wav';
    audio.load();
    audio.play();
  }

  getDocs(){
    // const url = environment.mongoUrl;
    const url = environment.mongoUrlLocal+"business";
    console.log(url)
    return this.http.get<any>(url)
      .pipe(
        map((response: any) => {
          console.warn("MONGO LESSONS", response)
          return response;
        }),


        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
}


