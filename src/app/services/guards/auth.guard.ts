import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../common/auth.service';
import { ENDPOINTS_APP } from '@app/config/endpoints';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  if (authService.isLoggedIn()) return true;
  else {
    router.navigate([ENDPOINTS_APP.login]);
    return false;
  }
};
