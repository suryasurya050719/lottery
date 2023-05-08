import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class InstandFound {
  constructor(private http: HttpClient) {}

  create(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/instandFound`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  list(): Observable<any> {
    let url = `${environment.apiurl}/instandFound`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  edite(filterdata: any): Observable<any> {
    let data = filterdata;
    let url = `${environment.apiurl}/instandFound`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  update(filterdata: any): Observable<any> {
    console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/instandFound`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
