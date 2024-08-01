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
    return this.httpService
      .get(`${ENDPOINTS_API.product}`)
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
}
