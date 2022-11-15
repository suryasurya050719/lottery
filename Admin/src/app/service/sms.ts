import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class sms {
  constructor(private http: HttpClient) {}

  sms(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/sms/excitingUserotp`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  newuserSms(data: any): Observable<any> {
    let url = `${environment.apiurl}/sms/newuserotp`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
