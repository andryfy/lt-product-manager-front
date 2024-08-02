import { Component, inject, Input, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '@app/config/interfaces';
import { ProductService } from '@app/services/entities/product.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.less',
})
export class ProductFormComponent {
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly productService: ProductService = inject(ProductService);
  private readonly message: NzMessageService = inject(NzMessageService);

  @Input() action: 'add' | 'edit' = 'add';
  @Input() product!: Product;

  productForm: FormGroup<{
    title: FormControl<string>;
    description: FormControl<string>;
    price: FormControl<number>;
  }> = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.action === 'edit' && !!this.product) {
      this.productForm.patchValue({ ...this.product });
    }
  }

  save(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value as Product;
      let source$!: Observable<boolean>;

      if (this.action === 'add') {
        source$ = this.productService.add(product);
      } else {
        product.id = this.product.id;
        source$ = this.productService.update(product);
      }

      source$.subscribe({
        next: (response: boolean) => {
          this.message.success('Produit enregisté');
        },
      });
    }
  }
}
