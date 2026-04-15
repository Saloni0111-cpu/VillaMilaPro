import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ Check if user is logged in
  if (auth.isLoggedIn()) {
    return true;
  }

  // ❌ Not logged in → redirect to login
  router.navigate(['/login']);
  return false;
};
