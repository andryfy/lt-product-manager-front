import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { ENDPOINTS_API } from '@app/config/endpoints';
import { ICredential } from '@app/config/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpService: HttpService = inject(HttpService);
  private readonly tokenService: TokenService = inject(TokenService);

  /**
   * Call login API
   * @param {ICredential} credential
   * @returns {Observable}
   */
  signIn(credential: ICredential): Observable<Object> {
    return this.httpService.post(ENDPOINTS_API.login, credential).pipe(
      tap((response: any) => {
        console.info('Login: ', response);
        if (response.success && !!response.data) {
          this.tokenService.set(response.data.token);
        }
      }),
      map(() => this.isLoggedIn())
    );
  }

  /**
   * Call register API
   * @param {ICredential} credential
   * @returns {Observable}
   */
  signUp(credential: ICredential): Observable<Object> {
    return this.httpService.post(ENDPOINTS_API.register, credential);
  }

  /**
   * Check token existence and validity
   * @returns {Boolean}
   */
  isLoggedIn(): boolean {
    return this.tokenService.isValid();
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  signOut() {
    return this.httpService.post('/auth/logout', {});
  }
}
