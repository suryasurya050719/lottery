import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  constructor(private http: HttpClient) {}

  customerandbrokercount(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/user/allbrokercustomercount`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  AccountList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/account/sharedaccountlist`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  AccountUpdate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/account/updateaccount`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  AccountRemove(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/account/accountdelete/${id}`;
    return this.http.delete(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  AccountStatusChange(data: any): Observable<any> {
    let url = `${environment.apiurl}/account/updateone`;
    let data01 = data;
    return this.http.put(url, data01).pipe(
      map((data) => {
        return data;
      })
    );
  }
  ManyAccountStatusChange(data: any): Observable<any> {
    let url = `${environment.apiurl}/account/updatemany`;
    let data01 = data;
    return this.http.put(url, data01).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
