import { inject, Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  share,
  switchMap,
  tap,
} from 'rxjs';
import { Product } from '@app/config/interfaces';
import { ENDPOINTS_API } from '@app/config/endpoints';

import qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpService: HttpService = inject(HttpService);

  public readonly change$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  handleChange(hasChange: boolean): void {
    if (hasChange) {
      this.change$.next(hasChange);
    }
  }

  change() {
    return this.change$.pipe(share());
  }

  getOne(id: number): Observable<Product> {
    return this.httpService
      .get(`${ENDPOINTS_API.product}/${id}`)
      .pipe(switchMap((response: any) => response.data)) as Observable<Product>;
  }

  getMany(filterOptions: any = {}): Observable<Product[]> {
    const query = qs.stringify(filterOptions);

    return this.httpService
      .get(`${ENDPOINTS_API.product}?${query}`)
      .pipe(map((response: any) => response.data ?? [])) as Observable<
      Product[]
    >;
  }

  add(product: Product): Observable<boolean> {
    return this.httpService.post(`${ENDPOINTS_API.product}`, product).pipe(
      switchMap((response: any) => of(response.data)),
      tap(() => this.handleChange(true))
    ) as Observable<boolean>;
  }

  update(product: Product): Observable<boolean> {
    return this.httpService
      .put(`${ENDPOINTS_API.product}/${product.id}`, product)
      .pipe(
        switchMap((response: any) => of(response.data)),
        tap(() => this.handleChange(true))
      ) as Observable<boolean>;
  }

  delete(product: Product): Observable<boolean> {
    return this.httpService
      .delete(`${ENDPOINTS_API.product}/${product.id}`)
      .pipe(
        switchMap((response: any) => of(response.data)),
        tap(() => this.handleChange(true))
      ) as Observable<boolean>;
  }
}
