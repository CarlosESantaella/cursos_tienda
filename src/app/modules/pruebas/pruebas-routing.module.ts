import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebasComponent } from './pruebas.component';
import { WompiComponent } from './wompi/wompi.component';

const routes: Routes = [
  {
    path: '',
    component: PruebasComponent,
    children: [
      {
        path: 'wompi',
        component: WompiComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebasRoutingModule { }
