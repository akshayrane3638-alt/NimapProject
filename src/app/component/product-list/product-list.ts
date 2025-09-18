import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
   import { Router } from '@angular/router';
   import { Product, ProductListResponse } from '../../models/product.model';
import { ProductService } from '../../service/product.service';

   @Component({
     selector: 'app-product-list',
     templateUrl: './product-list.html',
     standalone: true,
    imports: [CommonModule]
   })
   export class ProductListComponent implements OnInit {
     products: Product[] = [];
     loading = false;
     currentPage = 1;
     pageSize = 10;
     totalPages = 0;
     totalRecords = 0;

     constructor(
       private productService: ProductService,
       private router: Router
     ) {}

     ngOnInit() {
       this.loadProducts();
     }

     loadProducts() {
       //this.loading = true;
       this.productService.getAll().subscribe({
         next: (response: any) => {
           this.products = response.data;
           this.currentPage = 1; //response.pagination.page;
           this.pageSize = 10; //response.pagination.pageSize;
           this.totalPages = 1; // response.pagination.totalPages;
           this.totalRecords = this.products.length;
           //this.loading = false;
         },
         error: (error: any) => {
           console.error('Error loading products:', error);
           //this.loading = false;
         }
       });
     }

     onPageChange(page: number) {
       this.currentPage = page;
       this.loadProducts();
     }

     editProduct(id: number) {
       this.router.navigate(['/products/edit', id]);
     }

     deleteProduct(id: number) {
       if (confirm('Are you sure you want to delete this product?')) {
         this.productService.delete(id).subscribe({
           next: () => {
             this.loadProducts();
           },
           error: (error: any) => {
             console.error('Error deleting product:', error);
           }
         });
       }
     }

     get pages(): number[] {
       return Array.from({ length: this.totalPages }, (_, i) => i + 1);
     }

     getMin(a: number, b: number): number {
       return Math.min(a, b);
     }
}