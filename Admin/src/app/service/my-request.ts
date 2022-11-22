import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Myrequest {
  constructor(private http: HttpClient) {}

  MyrquestCreate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/myrequest`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  MyrquestList(data:any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/myrequest`;
    return this.http.get(url,{params:data}).pipe(
      map((data) => {
        return data;
      })
    );
  }

}
