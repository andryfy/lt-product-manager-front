import { CurrencyPipe, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '@app/config/interfaces';
import { ProductFormComponent } from '@app/modals/product-form/product-form.component';
import { ProductService } from '@app/services/entities/product.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgFor,
    CurrencyPipe,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzSpaceModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.less',
})
export class ProductListComponent {
  private readonly productService: ProductService = inject(ProductService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly message: NzMessageService = inject(NzMessageService);

  private subscription!: Subscription;

  searchForm: FormGroup<{
    keyword: FormControl<string>;
  }> = this.fb.group({
    keyword: [''],
  });

  @ViewChild('productFormComponent')
  productFormComponent!: ProductFormComponent;

  productList: Product[] = [];
  productSelected!: Product;
  loading: boolean = false;
  isVisibleProductFormModal: boolean = false;

  action: 'add' | 'edit' = 'add';

  ngOnInit(): void {
    this.getProductList();

    this.subscription = this.productService.change$.subscribe({
      next: (change: boolean) => {
        if (change) {
          this.getProductList();
        }
      },
    });
  }

  getProductList(filterOption: any = {}): void {
    this.loading = true;
    this.productService.getMany(filterOption).subscribe({
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
      nzOnOk: () => this.deleteProduct(this.productSelected),
    });
  }

  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
  }

  async deleteProduct(product: Product): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.productService.delete(product).subscribe({
        next: (response: boolean) => {
          this.cdr.detectChanges();
          return resolve(true);
        },
        error: (e) => {
          this.message.error('Une erreur est survenue.');
          return reject(e);
        },
      });
    });
  }

  search(): void {
    this.getProductList(this.searchForm.value);
  }
}
