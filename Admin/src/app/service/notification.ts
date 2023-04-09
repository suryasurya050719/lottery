import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  constructor(private http: HttpClient) {}

  GetList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/notification/AllList`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
