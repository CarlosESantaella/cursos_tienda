import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class TiendaAuthService {

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { }

  profileClient(){
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.authService.token
    });
    let URL = URL_SERVICIOS+"/ecommerce/profile";

    return this.http.post(URL, {}, {headers});
  }

  registerReview(data:any){
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.authService.token
    });
    let URL = URL_SERVICIOS+"/ecommerce/review";

    return this.http.post(URL, data, {headers});
  }
  updateReview(data:any, review_id:any){
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.authService.token
    });
    let URL = URL_SERVICIOS+"/ecommerce/review/"+review_id;

    return this.http.put(URL, data, {headers});
  }

  updateUser(data:any){
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.authService.token
    });
    let URL = URL_SERVICIOS+"/ecommerce/update_client";

    return this.http.post(URL, data, {headers});
  }
  showCourse(slug:string){
    let headers = new HttpHeaders({
      Authorization: 'Bearer '+this.authService.token
    });
    let URL = URL_SERVICIOS+"/ecommerce/course_leason/"+slug;

    return this.http.get(URL, {headers});
  }
}
