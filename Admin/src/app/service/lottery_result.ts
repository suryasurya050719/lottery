import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LotteryResult {
  constructor(private http: HttpClient) {}

  Preview(): Observable<any> {
    // console.log('filterdata service', filterdata);
    // let data = filterdata;
    let url = `${environment.apiurl}/lotery/preview`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
