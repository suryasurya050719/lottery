import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Board {
  constructor(private http: HttpClient) {}

  BoardCreate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/board/boardCreate`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  BoardList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/board/getall`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  BoardUpdate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/board/updateboard`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  BoardRemove(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/board/boarddelete/${id}`;
    return this.http.delete(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  GameCreate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/game/creategame`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  GameList(): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/game/getall`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  GameUpdate(filterdata: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    let data = filterdata;
    let url = `${environment.apiurl}/game/updategame`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  GameRemove(id: number): Observable<any> {
    // console.log('filterdata service', filterdata);
    let url = `${environment.apiurl}/game/gamedelete/${id}`;
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
  gameandboard(): Observable<any> {
    let url = `${environment.apiurl}/game/gameandboard`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
