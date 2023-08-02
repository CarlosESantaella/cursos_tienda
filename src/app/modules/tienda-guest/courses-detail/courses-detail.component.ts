import { Component } from '@angular/core';
import '../../../../assets/js/main.js';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';
import { AuthService } from '../../auth/service/auth.service';

declare var $: any;
declare function HOME_INIT([]): any;
declare function courseView(): any;
declare function showMoreBtn(): any;
declare function magnigyPopup(): any;

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css'],
})
export class CoursesDetailComponent {
  SLUG: any = null;
  LANDING_COURSE: any = null;
  courses_related_categories: any = null;
  courses_related_instructor: any = null;
  campaign_discount_id: any;
  DISCOUNT: any = null;
  user:any = null;

  have_course:any = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
    public authService: AuthService,
    public cartService: CartService,
    public router:Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((resp: any) => {
      console.log(resp.slug);
      this.SLUG = resp.slug;
    });
    this.activatedRoute.queryParams.subscribe((resp: any) => {
      console.log(resp);
      this.campaign_discount_id = resp.campaign_discount;
    });
    this.tiendaGuestService
      .landingCourse(this.SLUG, this.campaign_discount_id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.LANDING_COURSE = resp.course;
        this.courses_related_categories = resp.courses_related_categories;
        this.courses_related_instructor = resp.courses_related_instructor;
        this.DISCOUNT = resp.DISCOUNT;
        if(this.DISCOUNT){
          this.LANDING_COURSE.discount_g = resp.DISCOUNT;
        }
        setTimeout(() => {
          HOME_INIT($);

          magnigyPopup();
        }, 50);
        this.have_course = resp.hav_course;
      });
    setTimeout(() => {
      courseView();
      showMoreBtn();
    }, 50);
    this.user = this.cartService.authService.user;
  }

  getNewTotal(COURSE: any, DISCOUNT_BANNER: any) {
    if (DISCOUNT_BANNER.type_discount == 1) {
      return (
        COURSE.precio_usd -
        COURSE.precio_usd * (DISCOUNT_BANNER.discount * 0.01)
      ).toFixed(2);
    } else {
      return (COURSE.precio_usd - DISCOUNT_BANNER.discount).toFixed(2);
    }
  }

  getTotalPriceCourse(COURSE: any) {
    if (COURSE.discount_g) {
      return this.getNewTotal(COURSE, COURSE.discount_g);
    }
    return COURSE.precio_usd;
  }

  addCart(){
    console.log(this.user);
    if(!this.user){
      alert('NECESITAS REGISTRARTE EN LA TIENDA');
      this.authService.logout();
      this.router.navigate(["auth/login"]);
      return;
    }
    let data = {
      course_id: this.LANDING_COURSE.id,
      type_discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_discount : null,
      discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.discount : null,
      type_campaing: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_campaing : null,
      code_coupon: null,
      code_discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.code : null,
      precio_unitario: this.LANDING_COURSE.precio_usd,
      total: this.getTotalPriceCourse(this.LANDING_COURSE),
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
