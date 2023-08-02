import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';

declare function filterClickButton(): any;
declare var $: any;
declare function showMoreBtn(): any;

type hola = 'hola' | 'adios';
interface hola2{
  firstName: string;
  age: number;
};

@Component({
  selector: 'app-filter-courses',
  templateUrl: './filter-courses.component.html',
  styleUrls: ['./filter-courses.component.css'],
})
export class FilterCoursesComponent {
  CATEGORIES:any = [];
  INSTRUCTORS:any = [];
  LEVELS:any = [];
  IDIOMAS:any = [];

  LISTCOURSES:any = [];

  selected_option:number = 1;

  selected_categories:any = [];
  search: any = null;
  user:any = null;

  instructores_selected:any = [];
  min_price:number = 0;
  max_price:number = 0;

  idiomas_selected:any = [];
  levels_selected:any = [];

  rating_selected:number = 0;
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
    public cartService:CartService,
    public router:Router,
  ) {}

  ngOnInit() {
    this.user = this.tiendaGuestService.authService.user;
    this.activatedRoute.queryParams.subscribe((resp: any) => {
      console.log(resp);
    });

    // setTimeout(() => {
    //   // filterClickButton();
    //   $('#slider-range').slider({
    //     range: true,
    //     min: 10,
    //     max: 500,
    //     values: [0, 100],
    //     slide: (event: any, ui: any) => {
    //       console.log('$' + ui.values[0] + ' - $' + ui.values[1]);
    //       $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
    //       this.min_price = ui.values[0];
    //       this.max_price = ui.values[1];
    //       this.listCourses();
    //     },
    //   });
    //   $('#amount').val(
    //     '$' +
    //       $('#slider-range').slider('values', 0) +
    //       ' - $' +
    //       $('#slider-range').slider('values', 1)
    //   );
    // }, 50);

    
    
    this.tiendaGuestService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.INSTRUCTORS = resp.instructores;
      this.LEVELS = resp.levels;
      this.IDIOMAS = resp.idiomas;
      showMoreBtn();
    });

    
    this.activatedRoute.queryParams.subscribe((resp:any) => {
      console.log(resp);
      this.search = resp.search;
      this.listCourses();
    });
  }

  addOption(num:number){
    this.selected_option= num;
    if(num == 2){
      setTimeout(() => {
        // filterClickButton();
        $('#slider-range').slider({
          range: true,
          min: 10,
          max: 500,
          values: [10, 100],
          slide: (event: any, ui: any) => {
            console.log('$' + ui.values[0] + ' - $' + ui.values[1]);
            $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
            this.min_price = ui.values[0];
            this.max_price = ui.values[1];

          },
          stop: () => {
            this.listCourses();
          }
        });
        $('#amount').val(
          '$' +
            $('#slider-range').slider('values', 0) +
            ' - $' +
            $('#slider-range').slider('values', 1)
        );
      }, 50);
  
    }
  }

  listCourses(){

    let data = {
      search: this.search,
      selected_categories: this.selected_categories,
      instructores_selected: this.instructores_selected,
      min_price: this.min_price,
      max_price: this.max_price,
      idiomas_selected: this.idiomas_selected,
      levels_selected: this.levels_selected,
      rating_selected: this.rating_selected,
    };

    this.tiendaGuestService.listCourses(data).subscribe((resp:any) => {
      console.log(resp);
      this.LISTCOURSES = resp.courses.data;
    });

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

  addCategorie(CATEGORIE_ID:any){
    let INDEX = this.selected_categories.findIndex((item:any) => CATEGORIE_ID == item);
    if(INDEX != -1){
      this.selected_categories.splice(INDEX, 1);
    }else{
      this.selected_categories.push(CATEGORIE_ID);
    }
    // console.log(this.selected_categories);
    this.listCourses();
  }

  addInstructor(INSTRUCTOR:any){
    let INDEX = this.instructores_selected.findIndex((item:any) => INSTRUCTOR.id == item);
    if(INDEX != -1){
      this.instructores_selected.splice(INDEX, 1);
    }else{
      this.instructores_selected.push(INSTRUCTOR.id);
    }
    // console.log(this.instructores_selected);
    this.listCourses();
  }

  addIdiomas(IDIOMA:any){
    let INDEX = this.idiomas_selected.findIndex((item:any) => IDIOMA == item);
    if(INDEX != -1){
      this.idiomas_selected.splice(INDEX, 1);
    }else{
      this.idiomas_selected.push(IDIOMA);
    }
    // console.log(this.idiomas_selected);
    this.listCourses();
  }

  addLevels(LEVEL:any){
    let INDEX = this.levels_selected.findIndex((item:any) => LEVEL == item);
    if(INDEX != -1){
      this.levels_selected.splice(INDEX, 1);
    }else{
      this.levels_selected.push(LEVEL);
    }
    // console.log(this.levels_selected);
    this.listCourses();
  }

  selectedRating(num:number){
    this.rating_selected = num;
    this.listCourses();
  }
}
