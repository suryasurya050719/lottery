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
    let url = `${environment.apiurl}/shareAccount/sharedaccountlist`;
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
  GameStatusChange(id: number, status: string): Observable<any> {
    let url = `${environment.apiurl}/game/publice`;
    let data = {
      game_id: id,
      status: status,
    };
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
