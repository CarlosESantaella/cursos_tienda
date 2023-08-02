import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(!authService.user || !authService.token){
    router.navigate(["/auth/login"]);
    return false;
  }
  let token = authService.token;
  let expiration = (JSON.parse(atob(token.split('.')[1]))).exp;

  if(Math.floor((new Date).getTime()/1000) >= expiration){
    authService.logout();
    return false
  }

  return true;
};
