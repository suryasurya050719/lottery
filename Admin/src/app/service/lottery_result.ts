import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class LotteryResult {
  constructor(private http: HttpClient) {}

  Preview(data: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    // let data = filterdata;
    let url = `${environment.apiurl}/lotery/preview`
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data
      }),
    )
  }

  Published(data: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    // let data = filterdata;
    let url = `${environment.apiurl}/lotery/Published`
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data
      }),
    )
  }
  PublishedStatus(game_name: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    // let data = filterdata;
    let data = {
      game_name: game_name,
    }
    let url = `${environment.apiurl}/lotery/unpublishedShow`
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data
      }),
    )
  }
  winningRecord(game_name: any): Observable<any> {
    let url = `${environment.apiurl}/winning/AdminWinningResult`
    return this.http.get(url, { params: game_name }).pipe(
      map((data) => {
        return data
      }),
    )
  }

  published(game_name: any): Observable<any> {
    // console.log('filterdata service', filterdata);
    // let data = filterdata;
    // let data = {
    //   game_name: game_name,
    // };
    let url = `${environment.apiurl}/lotery/publishedShow`
    return this.http.get(url, { params: game_name }).pipe(
      map((data) => {
        return data
      }),
    )
  }
}
