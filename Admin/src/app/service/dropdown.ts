import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Dropdown {
  constructor(private http: HttpClient) {}

  board(): Observable<any> {
    let url = `${environment.apiurl}/dropdown/board`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  price(): Observable<any> {
    let url = `${environment.apiurl}/dropdown/price`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
