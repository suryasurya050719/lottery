import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APK {
  constructor(private http: HttpClient) {}

  create(filedata:any): Observable<any> {
        let data = new FormData();
        data.append('apk_id', filedata.apk_id);
        data.append('hint', filedata.hint);
        data.append('apkFile', filedata.apkFile);
        console.log('data',data);
    let url = `${environment.apiurl}/apk/create`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  list(): Observable<any> {
    let url = `${environment.apiurl}/apk/get`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  edite(filterdata: any): Observable<any> {
    let data = filterdata;
    let url = `${environment.apiurl}/apk/put`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  delete(id: number): Observable<any> {
    let url = `${environment.apiurl}/apk/delete`;
    return this.http.post(url,{id:id}).pipe(
      map((data) => {
        return data;
      })
    );
  }
//   singleRecord(id: number): Observable<any> {
//     let url = `${environment.apiurl}/live_result/${id}`;
//     return this.http.get(url).pipe(
//       map((data) => {
//         return data;
//       })
//     );
//   }
//   update(filterdata: any, id: string): Observable<any> {
//     console.log('filterdata service', filterdata);
//     let data = filterdata;
//     let url = `${environment.apiurl}/live_result/${id}`;
//     return this.http.put(url, data).pipe(
//       map((data) => {
//         return data;
//       })
//     );
//   }
}
