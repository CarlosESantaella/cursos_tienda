import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { BehaviorSubject } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(
    []
  );
  public currentData$ = this.cart.asObservable();

  constructor(public http: HttpClient, public authService: AuthService) {}

  addCart(DATACART: any) {
    let listCart = this.cart.getValue();
    let index = listCart.findIndex(
      (item) => item.course_id == DATACART.course_id
    );

    if (index == -1) {
      listCart.unshift(DATACART);
      this.cart.next(listCart);
    }
  }

  resetCart() {
    let listCart: any = [];

    this.cart.next(listCart);
  }

  removeItemCart(DATACART: any) {
    let listCart = this.cart.getValue();
    let index = listCart.findIndex((item) => (item.id = DATACART.id));
    if (index != -1) {
      listCart.splice(index, 1);
    }
    this.cart.next(listCart);
  }

  listCart() {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS+"/ecommerce/cart";
    return this.http.get(URL, {
      headers: headers
    });
  }

  registerCart(data: any) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS+"/ecommerce/cart";
    return this.http.post(URL, data, {
      headers: headers
    });
  }

  deleteCart(cart_id: any) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS+"/ecommerce/cart/"+cart_id;
    return this.http.delete(URL, {
      headers
    });
  }

  applyCoupon(data: any) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS+"/ecommerce/apply_coupon";
    return this.http.post(URL, data, {
      headers: headers
    });
  }

  checkout(data:any){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS+"/ecommerce/checkout";
    return this.http.post(URL, data, {
      headers
    });
  }
}
