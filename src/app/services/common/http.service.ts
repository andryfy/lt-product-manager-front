import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, retry, take, throwError } from 'rxjs';

import { environment } from '@env/environment.development';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface HeaderOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe: 'response';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly message: NzMessageService = inject(NzMessageService);

  private readonly APIUrl: string;
  private httpOptions!: HeaderOptions | any;

  constructor() {
    this.APIUrl = environment.API_URI;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    };
  }

  get(
    endpoint: string,
    otherUrl: boolean = false,
    options?: HeaderOptions
  ): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http
      .get(url, { ...this.httpOptions, ...options })
      .pipe(this.handleHttpResponse());
  }

  post(
    endpoint: string,
    body: NzSafeAny,
    otherUrl: boolean = false,
    options?: HeaderOptions
  ): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http
      .post(url, body, { ...this.httpOptions, ...options })
      .pipe(this.handleHttpResponse());
  }

  put(
    endpoint: string,
    body: NzSafeAny,
    otherUrl: boolean = false,
    options?: HeaderOptions
  ): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http
      .put(url, body, { ...this.httpOptions, ...options })
      .pipe(this.handleHttpResponse());
  }

  delete(
    endpoint: string,
    otherUrl: boolean = false,
    options?: HeaderOptions
  ): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http
      .delete(url, { ...this.httpOptions, ...options })
      .pipe(this.handleHttpResponse());
  }

  private getUrl(path: string, otherUrl: boolean): string {
    return otherUrl ? path : this.APIUrl + path;
  }

  private handleHttpResponse<T>(): (
    observable: Observable<T | HttpErrorResponse>
  ) => Observable<T | HttpErrorResponse> {
    return (observable: Observable<T | HttpErrorResponse>) =>
      observable.pipe(
        take(1),
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this.handleHttpError(error);
        })
      );
  }

  // Handle API errors
  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<HttpErrorResponse> {
    // this.message.warning('Indentifiant ou mot de passe incorrect');
    /* If it's an error due from the client */
    if (!(error.status >= 400 && error.status < 500)) {
      this.message.error(
        "Une erreur s'est produite. Veuillez réessayer plus tard",
        {
          nzDuration: 5000,
          nzAnimate: true,
        }
      );
    }
    // return an observable with a user-facing error message
    return throwError(
      () =>
        new HttpErrorResponse({
          error: error.name,
          status: error.status,
          statusText: error.statusText,
        })
    );
  }
}
