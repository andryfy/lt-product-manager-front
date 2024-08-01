import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { ENDPOINTS_APP } from '@app/config/endpoints';
import { AuthService } from '../common/auth.service';

export const noAuthGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  if (authService.isLoggedOut()) return true;
  else {
    router.navigate([ENDPOINTS_APP.home]);
    return false;
  }
};
