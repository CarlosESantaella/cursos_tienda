import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationExtras, Params, Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CartService } from 'src/app/modules/tienda-guest/service/cart.service';
import { TiendaGuestService } from 'src/app/modules/tienda-guest/service/tienda-guest.service';

declare function cardSidenav(): any;
declare function _clickDocTwo(): any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  user: any = null;
  listCarts: any = null;
  totalSum: any = null;

  search: any = null;

  @ViewChild('filter') filter?: ElementRef;
  source: any;

  listCourses: any = [];

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public router: Router,
    public tiendaGuest: TiendaGuestService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user;

    this.cartService.currentData$.subscribe((resp: any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce(
        (sum: number, item: any) => sum + item.total,
        0
      );

      if (this.user) {
        this.cartService.listCart().subscribe((resp: any) => {
          resp.carts.data.forEach((cart: any) => {
            this.cartService.addCart(cart);
          });
        });
      }

      setTimeout(() => {
        cardSidenav();
        _clickDocTwo();
      }, 50);
    });
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, 'keyup');
    this.source.pipe(debounceTime(500)).subscribe((resp: any) => {
      console.log(this.search);
      //es el filtro
      let data = {
        search: this.search,
      };
      if(this.search.length > 0){

        this.tiendaGuest.listCourses(data).subscribe((resp: any) => {
          this.listCourses = resp.courses.data;
        });
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

  removeItem(cart: any) {
    this.cartService.deleteCart(cart.id).subscribe((resp: any) => {
      console.log(resp);
      alert('ITEM DEL CARRITO ELIMINADO CORRECTAMENTE');
      this.cartService.removeItemCart(cart);
    });
  }

  searchCourses() {
    console.log('si funciono!');
    let queryParams = {
      search: this.search
    };
    document.querySelector('html')?.classList.remove('side-nav-opened');
    this.router.navigate(['/listado-de-cursos'], {queryParams});
  }
}
