import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaGuestRoutingModule } from './tienda-guest-routing.module';
import { TiendaGuestComponent } from './tienda-guest.component';
import { CoursesDetailComponent } from './courses-detail/courses-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from './service/cart.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterCoursesComponent } from './filter-courses/filter-courses.component';

@NgModule({
  declarations: [
    TiendaGuestComponent,
    CoursesDetailComponent,
    FilterCoursesComponent
  ],
  imports: [
    CommonModule,
    TiendaGuestRoutingModule,
    //
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    CartService
  ]
})
export class TiendaGuestModule { }
