import { inject, Injectable } from '@angular/core';
import { User } from '@app/config/interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, share, tap } from 'rxjs';
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

  setUser(user: User): Observable<User> {
    const token: string = this.tokenService.token ?? '';
    this.user$.next(user);
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const { id } = jwtHelper.decodeToken(token);

    return this.getOne(id).pipe(tap((user) => this.user$.next(user)));
  }

  getOne(id: number): Observable<any> {
    return this.httpService.get(`${ENDPOINTS_API.user}/${id}`);
  }
}
