import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { TiendaAuthService } from '../service/tienda-auth.service';


@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css'],
})
export class ProfileClientComponent {
  nav_option: number = 5;

  enrolled_course_count:number = 0;
  active_course_count:number = 0;
  termined_course_count:number = 0;

  user:any = null;

  enrolled_course:any = [];
  active_course:any = [];
  termined_course:any = [];

  sale_details:any = [];
  sale_detail_selected:any = null;
  message:any = null;
  rating:number = 0;
  sales:any = [];
  sale_selected:any = null;

  name:any = null;
  surname:any = null;
  email:any = null;
  phone:any = null;
  profesion:any = null;
  description:any = null;
  password:any = null;
  new_password:any = null;
  file_imagen:any = null;

  constructor(public authService: AuthService, public tiendaAuth:TiendaAuthService) {}

  ngOnInit() {
    this.tiendaAuth.profileClient().subscribe((resp:any) => {
      console.log(resp);
      this.enrolled_course_count = resp.enrolled_course_count;
      this.active_course_count = resp.active_course_count;
      this.termined_course_count = resp.termined_course_count ?? 0;
      this.user = resp.user;

      this.name = this.user.name;
      this.surname = this.user.surname;
      this.email = this.user.email;
      this.phone = this.user.phone;
      this.profesion = this.user.profesion;
      this.description = this.user.descripcion;

      this.enrolled_course = resp.enrolled_course;
      this.active_course = resp.active_course;
      this.termined_course = resp.termined_course;
      this.sale_details = resp.sale_details;
      this.sales = resp.sales.data;
    });
  }

  navOption(num: number) {
    this.nav_option = num;
  }

  logout() {
    this.authService.logout();
  }
  openReview(sd:any){
    this.sale_detail_selected = sd;
    if(this.sale_detail_selected.review){
      this.rating = this.sale_detail_selected.review.rating;
      this.message = this.sale_detail_selected.review.message;

    }
  }

  selectedRating(rating:any){
    this.rating = rating;
  }

  saveReview(){
    if(!this.message || !this.rating){
      alert("LA CALIFICACIÓN Y EL MENSAJE SON OBLIGATIOS");
    }
    let data = {
      course_id: this.sale_detail_selected.course.id,
      sale_detail_id: this.sale_detail_selected.id,
      message: this.message,
      rating: this.rating
    };
    console.log(data, 'hola mundo 1');
    this.tiendaAuth.registerReview(data).subscribe((resp:any) => {
      console.log(resp);
      alert("LA RESEÑA SE REGISTRO CORRECTAMENTE");
      let INDEX = this.sale_details.findIndex((item:any) => item.id == this.sale_detail_selected.id);

      if(INDEX != -1){
        this.sale_details[INDEX].review = resp.review;
      }
    })
  }

  updateReview(){
    if(!this.message || !this.rating){
      alert("LA CALIFICACIÓN Y EL MENSAJE SON OBLIGATIOS");
    }
    let data = {
      course_id: this.sale_detail_selected.course.id,
      sale_detail_id: this.sale_detail_selected.id,
      message: this.message,
      rating: this.rating
    };
    console.log(data, 'hola mundo 1');
    this.tiendaAuth.updateReview(data, this.sale_detail_selected.review.id).subscribe((resp:any) => {
      console.log(resp);
      alert("LA RESEÑA SE ACTUALIZO CORRECTAMENTE");
      let INDEX = this.sale_details.findIndex((item:any) => item.id == this.sale_detail_selected.id);

      if(INDEX != -1){
        this.sale_details[INDEX].review = resp.review;
      }
    })
  }

  backList(){
    this.sale_detail_selected = null;
    this.rating = 0;
    this.message = null;
  }

  selectedSale(sale:any){
    this.sale_selected = sale;
  }

  getNameCampaing(type: number) {
    let Name = '';
    switch (type) {
      case 1:
        Name = 'CAMPAÑA NORMAL';
        break;
      case 2:
        Name = 'CAMPAÑA FLASH';
        break;
      case 3:
        Name = 'CAMPAÑA BANNER';
        break;
    }
    return Name;
  }

  updateUser(){
    let data = {};
    if(this.password || this.new_password){
      if(this.password != this.new_password){
        alert("LAS CONTRASEÑAS NO SON IGUALES");
        return;
      }
      // data = {
      //   name: this.name,
      //   surname: this.surname,
      //   email: this.email,
      //   phone: this.phone,
      //   profesion: this.profesion,
      //   description: this.description,
      //   password: this.password
      // };
    }

    let formData = new FormData();

    if(this.file_imagen){
      formData.append("imagen", this.file_imagen);

    }
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("phone", this.phone);
    formData.append("profesion", this.profesion);
    formData.append("description", this.description);
    if(this.password){
      formData.append("password", this.password);
    }


    console.log(data);
    this.tiendaAuth.updateUser(formData).subscribe((resp:any) => {
      console.log(resp);
      alert("LOS REGISTROS SE ACTUALIZARON CORRECTAMENTE");
    })
  }

  processFile($event:any){
    this.file_imagen = $event.target.files[0];
  }
}
