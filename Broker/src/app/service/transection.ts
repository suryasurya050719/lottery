import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Transection {
  constructor(private http: HttpClient) {}

  Alluser(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/transection/alluser`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }
  singleTransectionList(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/transection/singleUserList`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  referalTransectionList(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/transection/referal_user_trans_list/${filterdata.id}`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  payment(data: any): Observable<any> {
    let url = `${environment.apiurl}/payment`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  Addmony(data: any): Observable<any> {
    let url = `${environment.apiurl}/transection/addmony`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  singleUserTransection(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/transection/singleuser`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }
  singleuser(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/transection/singleuser`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
