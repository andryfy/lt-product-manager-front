import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Product } from '@app/config/interfaces';
import { ProductFormComponent } from '@app/modals/product-form/product-form.component';
import { ProductService } from '@app/services/entities/product.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgFor,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzSpaceModule,
    NzModalModule,
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.less',
})
export class ProductListComponent {
  private readonly productService: ProductService = inject(ProductService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly modal: NzModalService = inject(NzModalService);

  private subscription!: Subscription;

  @ViewChild('productFormComponent')
  productFormComponent!: ProductFormComponent;

  productList: Product[] = [];
  productSelected!: Product;
  loading: boolean = false;
  isVisibleProductFormModal: boolean = false;

  action: 'add' | 'edit' = 'add';

  ngOnInit(): void {
    this.getProductList();

    this.productService.change$.subscribe({
      next: (change: boolean) => {
        if (change) {
          this.getProductList();
        }
      },
    });
  }

  getProductList(): void {
    this.loading = true;
    this.productService.getMany().subscribe({
      next: (data: Product[]) => {
        this.productList = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  sortByTitle(a: Product, b: Product) {
    return a.title.localeCompare(b.title);
  }

  comparePrice(a: Product, b: Product) {
    return a.price - b.price;
  }

  onSelectProduct(product: Product): void {
    this.productSelected = product;
  }

  openProductFormModal(action: 'add' | 'edit'): void {
    this.action = action;
    this.isVisibleProductFormModal = true;
  }

  handleOk(): void {
    if (!!this.productFormComponent) {
      this.productFormComponent.save();
    }
    this.isVisibleProductFormModal = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisibleProductFormModal = false;
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Suppression',
      nzContent: 'Etes-vous sûr de supprimer ce produit?',
      nzCentered: true,
      nzOkDanger: true,
      nzOnOk: () => console.log('OK'),
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
