import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerCare {
  constructor(private http: HttpClient) {}

  QuestionCreate(
    question: string,
    answer: string,
    file: any,
    id: any
  ): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = new FormData();
    data.append('question', question);
    data.append('answer', answer);
    data.append('customerImage', file);
    data.append('id', id);
    let url = `${environment.apiurl}/customer_info`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  GetList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/customer_info`;
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
  Remove(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/customer_info/${id}`;
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
