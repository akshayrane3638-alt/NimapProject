import { Component, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
})
export class ProductFormComponent implements OnInit, AfterViewInit, OnDestroy {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;

  loading = signal<boolean>(false);
  showContent = signal<boolean>(false);
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
    }
    // Don't fetch data here for SSR
  }

  ngAfterViewInit() {
    // Delay rendering to avoid SSR hydration issues
    setTimeout(() => {
      this.showContent.set(true);
      this.loadCategories();

      if (this.isEditMode && this.productId) {
        this.loadProduct();
      }
    }, 50);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.categoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: Category[]) => this.categories = categories,
        error: (error) => console.error('Error loading categories:', error)
      });
  }

  loadProduct() {
    if (!this.productId) return;

    this.loading.set(true);
    this.productService.getById(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product: Product) => {
          this.productForm.patchValue(product);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading.set(false);
        }
      });
  }

onSubmit() {
  if (!this.productForm.valid) return;

  this.loading.set(true);

  const formValue = this.productForm.value; // { name: 'xxx', price: ..., category_id: ... }

  const payload: Product = {
    productName: formValue.name,
    Price: formValue.price,
    categoryId: formValue.category_id
  };

  if (this.isEditMode && this.productId) {
    this.productService.update(this.productId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => {
          console.error('Error updating product:', error);
          this.loading.set(false);
        }
      });
  } else {
    this.productService.create(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => {
          console.error('Error creating product:', error);
          this.loading.set(false);
        }
      });
  }
}

//   onSubmit() {
//     if (!this.productForm.valid) return;

//     const productData: Product = this.productForm.value;
//     this.loading.set(true);
//     const formValue = this.productForm.value; // { name: 'xxx', description: ..., price: ..., category_id: ... }

//     const payload: Product = {
//   productName: formValue.name,   // map 'name' to 'productName'
//   description: formValue.description,
//   price: formValue.price,
//   category_id: formValue.category_id
// };
//     if (this.isEditMode && this.productId) {
//       this.productService.update(this.productId, productData)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: () => this.router.navigate(['/products']),
//           error: (error) => {
//             console.error('Error updating product:', error);
//             this.loading.set(false);
//           }
//         });
//     } else {
//       this.productService.create(productData)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: () => this.router.navigate(['/products']),
//           error: (error) => {
//             console.error('Error creating product:', error);
//             this.loading.set(false);
//           }
//         });
//     }
//   }

  onCancel() {
    this.router.navigate(['/products']);
  }
}
