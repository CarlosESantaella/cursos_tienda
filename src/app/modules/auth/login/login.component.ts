import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Route, Router } from '@angular/router';

declare function _clickDoc():any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  
  //auth-login
  email:any = null;
  password:any = null;

  // auth-register
  email_register:any = null;
  password_register:any = null;
  name:any = null;
  surname:any = null;
  password_confirmation:any = null;

  constructor(
    public authService:AuthService,
    public router:Router,
    private cdr: ChangeDetectorRef,
    private ngZone:NgZone
  ){}

  ngOnInit(){

    setTimeout(() => {
      _clickDoc();
    }, 50);
    console.log(this.authService.user);
    if(this.authService.user){
      this.router.navigateByUrl("/");
      return;
    }
      
    
  }

  login():any{

    if(!this.email || !this.password){

      alert("NECESITAS INGRESAR TODOS LO CAMPOS");

      return false;
    }
    this.authService.login(this.email, this.password).subscribe(
      (resp:any) => {
        console.log([resp, 'hola mundo 2']);
        if(resp){
          this.router.navigate(['/']);
        }else{
          alert("LAS CREDENCIALES NO EXISTEN");
        }
        this.ngZone.run(() => {
          // update the data of the component
        });
      }
    );

  }

  register(){
    if(!this.email_register || !this.name || !this.surname || !this.password_register || !this.password_confirmation){
      alert("TODOS LOS CAMPOS SON NECESARIOS");
      return;
    }
    if(this.password_register != this.password_confirmation){
      alert("LAS CONTRASEÑAS SON DIFERENTES");
      return;
    }
    let data = {
      email: this.email_register,
      name: this.name,
      surname: this.surname,
      password: this.password_register,
    }

    this.authService.register(data).subscribe((resp:any) => {
      alert("SE HA REGISTRADO CORRECTAMENTE");
      console.log(resp);
    }, error => {
      alert("ERROR AL INTRODUCIR VALORES AL FORMULARIO DE REGISTRO");
      console.error([error, 'hola mundo']);
      
    })
  }
}

