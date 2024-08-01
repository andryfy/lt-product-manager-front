import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '@app/services/guards/auth.guard';
import { ProductListComponent } from './product-list/product-list.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [{ path: '', component: ProductListComponent }],
  },
];
