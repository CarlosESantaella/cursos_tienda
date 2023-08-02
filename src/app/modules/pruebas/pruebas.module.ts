import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PruebasRoutingModule } from './pruebas-routing.module';
import { PruebasComponent } from './pruebas.component';
import { WompiComponent } from './wompi/wompi.component';


@NgModule({
  declarations: [
    PruebasComponent,
    WompiComponent
  ],
  imports: [
    CommonModule,
    PruebasRoutingModule
  ]
})
export class PruebasModule { }
