import { inject, Injectable } from '@angular/core';
import { User } from '@app/config/interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, share, switchMap, tap } from 'rxjs';
import { TokenService } from '../common/token.service';
import { HttpService } from '../common/http.service';
import { ENDPOINTS_API } from '@app/config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpService: HttpService = inject(HttpService);
  private readonly tokenService: TokenService = inject(TokenService);
  private user$ = new BehaviorSubject<User>({ id: 0, username: '' });

  get user() {
    return this.user$.pipe(share());
  }

  setUser(): Observable<any> {
    const token: string = this.tokenService.token ?? '';

    const jwtHelper: JwtHelperService = new JwtHelperService();
    console.log('DecodeToken: ', jwtHelper.decodeToken(token));

    const { sub } = jwtHelper.decodeToken(token);

    return this.httpService
      .get(`${ENDPOINTS_API.user}/${sub}`)
      .pipe(tap((response: any) => this.user$.next(response.data)));
  }
}
