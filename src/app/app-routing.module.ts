import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './modules/auth/service/auth.guard';

const routes: Routes = [
  {
    path: '',
    // canActivate: [authGuard],
    loadChildren: () => import("./modules/home/home.module").then(m => m.HomeModule),
  },
  {
    path: '',
    // canActivate: [authGuard],
    loadChildren: () => import("./modules/tienda-guest/tienda-guest.module").then(m => m.TiendaGuestModule),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import("./modules/tienda-auth/tienda-auth.module").then(m => m.TiendaAuthModule),
  },
  {
    path: 'auth',
    loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: 'pruebas',
    loadChildren: () => import("./modules/pruebas/pruebas.module").then(m => m.PruebasModule)
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
