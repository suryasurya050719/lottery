import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Login {
  constructor(private http: HttpClient) {}

  Login(phone: string, password: string): Observable<any> {
    let form = {
      phone: phone,
      password: password,
    };
    console.log('form', form);
    let url = `${environment.apiurl}/user/login`;
    return this.http.post(url, form).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  Alluser(user_id: any, phone: any, role_id: any): Observable<any> {
    let data = {
      user_id: user_id,
      phone: phone,
      role_id: role_id,
    };
    let url = `${environment.apiurl}/user/all`;
    return this.http.get(url, { params: data }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  Registor(data: any): Observable<any> {
    let url = `${environment.apiurl}/user/registor`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  singleUser(id: number): Observable<any> {
    let url = `${environment.apiurl}/user/singleuser/${id}`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  referedUser(
    id: any,
    user_id: any,
    phone: any,
    role_id: any
  ): Observable<any> {
    let data = {
      user_id: user_id,
      phone: phone,
      role_id: role_id,
    };
    let url = `${environment.apiurl}/user/refereduser/${id}`;
    return this.http.get(url, { params: data }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  StatusChange(id: number, status: string): Observable<any> {
    let url = `${environment.apiurl}/user/update`;
    let data = {
      uset_id: id,
      status: status,
    };
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  delete(id: number): Observable<any> {
    let url = `${environment.apiurl}/user/delete/${id}`;
    return this.http.delete(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  UserUpdate(id: number, name: string, phone: number): Observable<any> {
    let url = `${environment.apiurl}/user/userUpdate`;
    let data = {
      user_id: id,
      name: name,
      phone: phone,
    };
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  forgotPassword(data: any): Observable<any> {
    let url = `${environment.apiurl}/user/forgotpassword`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  singleUserBankAccountOnly(id: number): Observable<any> {
    let url = `${environment.apiurl}/user/singleuserbankAccount/${id}`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }
  ChangePassword(data:any): Observable<any> {
    let url = `${environment.apiurl}/user/changePassword`;
    return this.http.put(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
