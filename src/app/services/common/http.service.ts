import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  map,
  retry,
  take,
  throwError,
} from 'rxjs';

import { environment } from '@env/environment';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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
  private http: HttpClient = inject(HttpClient);

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

  // Handle API errors
  private handleHttpError(error: HttpErrorResponse): Observable<NzSafeAny> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else if (error instanceof HttpErrorResponse) {
      // The backend returned an unsuccessful response code.
      // console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      () =>
        new HttpErrorResponse({
          error: error.type,
          status: error.status,
          statusText: error.message,
        })
    );
  }

  private handleHttpResponse<T>(): (
    observable: Observable<T>
  ) => Observable<T> {
    return (observable: Observable<T>) =>
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
}
