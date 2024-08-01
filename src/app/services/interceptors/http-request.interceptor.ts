import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { ENDPOINTS_API, ENDPOINTS_APP } from '@app/config/endpoints';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from '../common/token.service';
import { TOKEN_HEADER_KEY, TOKEN_PREFIX } from '@app/config/constant';
import { AuthService } from '../common/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private message: NzMessageService = inject(NzMessageService);
  private tokenService: TokenService = inject(TokenService);
  private authService: AuthService = inject(AuthService);

  intercept(
    request: HttpRequest<NzSafeAny>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> | Observable<any> {
    let authRequest = request;
    if (!authRequest.url.includes(ENDPOINTS_API.login)) {
      const token = this.tokenService.token;
      if (!!token) {
        authRequest = this.addTokenHeader(request, token);
      }
    }

    return next.handle(authRequest).pipe(
      catchError((error) => {
        console.error('HttpRequestError: ', error);
        // Check if it's an authentication error
        if (
          error instanceof HttpErrorResponse &&
          !authRequest.url.includes(ENDPOINTS_API.login) &&
          (error.status === 401 || error.status === 403)
        ) {
          return this.authService.signOut();
        }
        // Else : it's a server error
        return this.handleError(error, request);
      })
    );
  }

  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>
  ): Observable<never> {
    const status = error.status;
    /* If it's not an error due from the client */
    if (status >= 400 && status < 500) {
      this.message.warning(
        !!error.error && !!error.error.error && !!error.error.error.message
          ? error.error.error.message
          : error.statusText,
        {
          nzDuration: 5000,
          nzAnimate: true,
        }
      );
    } else {
      this.message.error('An error occurred. Please try again later', {
        nzDuration: 5000,
        nzAnimate: true,
      });
    }

    return throwError(
      () =>
        new HttpErrorResponse({
          error: error.type,
          status: error.status,
          headers: request.headers,
          url: request.url,
          statusText: error.message,
        })
    );
  }

  private addTokenHeader(
    request: HttpRequest<NzSafeAny>,
    token: string
  ): HttpRequest<NzSafeAny> {
    if (!request.url.includes(ENDPOINTS_APP.login)) {
      return request.clone({
        headers: request.headers.set(
          TOKEN_HEADER_KEY,
          `${TOKEN_PREFIX} ${token}`
        ),
      });
    } else {
      request.headers.delete(TOKEN_HEADER_KEY);
      return request;
    }
  }
}
