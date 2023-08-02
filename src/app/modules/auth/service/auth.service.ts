import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { URL_FRONTEND, URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any = null;
  token:any = null;
  counter:number = 0;

  constructor(
    public http:HttpClient,
    public router:Router,
  ) {
    this.initAuth();
  }

  initAuth(){


    if(localStorage.getItem("token")){
      this.user  = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token");
    }
    this.me().subscribe((resp:any) => {

      if(!resp){
        this.logout();
      }
    });
  }

  login(email:string, password:string){
    let URL = URL_SERVICIOS+"/auth/login_tienda";
    return this.http.post(URL,{
      email: email,
      password: password
    })
    .pipe(
      switchMap((auth:any) => {
        this.counter++;
        console.log([auth, this.counter, 'hola mundo']);
        const result = this.saveLocalStorage(auth);
        return of(result);
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      })
    );
  }

  me(){
    let URL = URL_SERVICIOS+"/auth/me";
    console.log(this.token, 'token');
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.token
    });
    return this.http.post(URL, {}, {
      headers: headers
    });
  }

  saveLocalStorage(auth:any):any{
    if(auth && auth.access_token){
      localStorage.setItem("token", auth.access_token);
      localStorage.setItem("user", JSON.stringify(auth.user));
      this.user  = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token");
      return true;
    }
  }

  register(data:any){
    let URL = URL_SERVICIOS + "/auth/register";
    return this.http.post(URL, data);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.user  = null;
    this.token = null;

    this.router.navigate(['auth/login']);

  }
}
