import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedAccount {
  constructor(private http: HttpClient) {}

  AccountCreate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/shareAccount`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  OwnAccountList(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/shareAccount/singleuserlist`;
    return this.http.get(url,{ params: {id} }).pipe(
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
