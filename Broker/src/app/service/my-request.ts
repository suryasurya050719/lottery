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
  MyrquestList(data: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/myrequest`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }
  Myrquesapproved(datas: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = new FormData();
    data.append('customerImage', datas.imagedata);
    data.append('id', datas.id);
    data.append('user_id', datas.user_id);
    data.append('amount', datas.amount);

    let url = `${environment.apiurl}/myrequest/approved`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  Myrquesrejected(datas: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/myrequest/rejected`;
    return this.http.put(url, datas).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
