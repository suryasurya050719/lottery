import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketPrice {
  constructor(private http: HttpClient) {}

  TicketPriceCreate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/ticket_price`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  TicketPriceList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/ticket_price`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  TicketPriceUpdate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/ticket_price`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  TicketPriceRemove(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/ticket_price/${id}`;
    return this.http.delete(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
