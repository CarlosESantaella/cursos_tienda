import { Component } from '@angular/core';
import { HomeService } from './services/home.service';
import { CartService } from '../tienda-guest/service/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';

declare var $:any;
declare function HOME_INIT([]):any;
declare function banner_home():any;
declare function countdownT():any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  CATEGORIES:any = [];
  COURSES_HOME:any = [];
  group_courses_categories:any = [];
  DISCOUNT_BANNER:any = null;
  DISCOUNT_BANNER_COURSES:any = [];
  DISCOUNT_FLASH:any = null;
  DISCOUNT_FLASH_COURSES:any = [];
  user:any = null;

  constructor(
    public homeService:HomeService,
    public cartService:CartService,
    public router:Router,
  ){

  }

  ngOnInit(){
    
    this.homeService.home().subscribe((resp:any) =>  {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.COURSES_HOME = resp.courses.data;
      this.group_courses_categories = resp.group_courses_categories;
      this.DISCOUNT_BANNER = resp.DISCOUNT_BANNER;
      this.DISCOUNT_BANNER_COURSES = resp.DISCOUNT_BANNER_COURSES;
      this.DISCOUNT_FLASH = resp.DISCOUNT_FLASH;
      this.DISCOUNT_FLASH_COURSES = resp.DISCOUNT_FLASH_COURSES;
      setTimeout(() =>{
        HOME_INIT($);
      }, 50);
      setTimeout(() => {
        banner_home();
        countdownT();
      }, 20);
    })

    this.user = this.cartService.authService.user;
  }

  getNewTotal(COURSE:any, DISCOUNT_BANNER:any){

    if(DISCOUNT_BANNER.type_discount == 1){
      return (COURSE.precio_usd - COURSE.precio_usd*(DISCOUNT_BANNER.discount*0.01)).toFixed(2);
    }else{
      return (COURSE.precio_usd - DISCOUNT_BANNER.discount).toFixed(2);
    }
  }

  getTotalPriceCourse(COURSE:any){
    if(COURSE.discount_g){
      return this.getNewTotal(COURSE, COURSE.discount_g);
    }
    return COURSE.precio_usd;
  }


  addCart($event:any, LANDING_COURSE:any){
    $event.preventDefault();
    console.log(this.user);
    if(!this.user){
      alert('NECESITAS REGISTRARTE EN LA TIENDA');
      this.router.navigate(["auth/login"]);
      return;
    }
    let data = {
      course_id: LANDING_COURSE.id,
      type_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_discount : null,
      discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.discount : null,
      type_campaing: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_campaing : null,
      code_coupon: null,
      code_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.code : null,
      precio_unitario: LANDING_COURSE.precio_usd,
      total: this.getTotalPriceCourse(LANDING_COURSE),
    };
    this.cartService.registerCart(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }else{
        alert("EL CURSO SE AGREGO AL CARRITO EXITOSAMENTE");
        this.cartService.addCart(resp.cart);
      }
    })
  }
}
