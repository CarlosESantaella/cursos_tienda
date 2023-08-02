import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wompi',
  templateUrl: './wompi.component.html',
  styleUrls: ['./wompi.component.css']
})
export class WompiComponent {



  constructor(
    public http:HttpClient
  ){
  }


  ngOnInit(){

    let URL = "https://api.wompi.sv/EnlacePago";

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.http.post(URL, {
      identificadorEnlaceComercio: "e9d57f8c-e6dd-4984-8610-d0e4b0aa99a5",
      monto: 20,
      nombreProducto: "string"
    },{headers}).subscribe((resp:any) => {
      console.log(resp);
    });
  }
}

