import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
   import { FormBuilder, FormGroup, Validators } from '@angular/forms';
   import { ActivatedRoute, Router } from '@angular/router';

   import { Product } from '../../models/product.model';
   import { Category } from '../../models/category.model';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';

   @Component({
     selector: 'app-product-form',
     templateUrl: './product-form.html',
     standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
   })
   export class ProductFormComponent implements OnInit {
     productForm: FormGroup;
     isEditMode = false;
     productId?: number;
     loading = false;
     categories: Category[] = [];

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
       this.loadCategories();
       const id = this.route.snapshot.paramMap.get('id');
       if (id) {
         this.isEditMode = true;
         this.productId = +id;
         this.loadProduct();
       }
     }

     loadCategories() {
       this.categoryService.getAll().subscribe({
         next: (categories: Category[]) => {
           this.categories = categories;
         },
         error: (error: any) => {
           console.error('Error loading categories:', error);
         }
       });
     }

     loadProduct() {
       if (this.productId) {
         this.loading = true;
         this.productService.getById(this.productId).subscribe({
           next: (product: Product) => {
             this.productForm.patchValue(product);
             this.loading = false;
           },
           error: (error: any) => {
             console.error('Error loading product:', error);
             this.loading = false;
           }
         });
       }
     }

     onSubmit() {
       if (this.productForm.valid) {
         const productData: Product = this.productForm.value;
         
         if (this.isEditMode && this.productId) {
           this.productService.update(this.productId, productData).subscribe({
             next: () => {
               this.router.navigate(['/products']);
             },
             error: (error: any) => {
               console.error('Error updating product:', error);
             }
           });
         } else {
           this.productService.create(productData).subscribe({
             next: () => {
               this.router.navigate(['/products']);
             },
             error: (error: any) => {
               console.error('Error creating product:', error);
             }
           });
         }
       }
     }

     onCancel() {
       this.router.navigate(['/products']);
     }
   }