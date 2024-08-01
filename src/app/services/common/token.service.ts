import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TOKEN_KEY } from '@app/config/constant';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storageService: StorageService = inject(StorageService);

  get token(): string | null {
    return this.storageService.get(TOKEN_KEY);
  }

  set(token: string) {
    if (!token) {
      this.storageService.remove(TOKEN_KEY);
    } else {
      this.storageService.set(TOKEN_KEY, token);
    }
    return this;
  }

  isValid(): boolean {
    const jwtHelper: JwtHelperService = new JwtHelperService();
    return !!this.token && !jwtHelper.isTokenExpired(this.token);
  }
}
