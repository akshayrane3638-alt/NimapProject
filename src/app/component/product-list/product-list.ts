import { Component, OnInit } from '@angular/core';
import { CommonModule , AsyncPipe} from '@angular/common';
   import { Router } from '@angular/router';
   import { Product, ProductListResponse } from '../../models/product.model';
import { ProductService } from '../../service/product.service';
import { map, Observable, tap } from 'rxjs';
import { RouterOutlet, RouterModule } from '@angular/router';



   @Component({
     selector: 'app-product-list',
     templateUrl: './product-list.html',
     standalone: true,
    imports: [CommonModule, AsyncPipe, RouterModule]
   })
   export class ProductListComponent implements OnInit {
     products$!: Observable<Product[]>;

     loading = false;
     currentPage = 1;
     pageSize = 10;
     totalPages = 0;
     totalRecords = 0;

     constructor(
       private productService: ProductService,
       private router: Router
     ) {}

    //  ngOnInit() {
    //    this.products$ = this.loadProducts();
    //  }

 ngOnInit() {
  this.loadProducts();
  this.products$.subscribe(data => console.log('Subscribed data:', data));
}


 loadProducts() {
  this.products$ = this.productService.getAll().pipe(
    tap((response: any) => {
      console.log('API Response:', response);

      const data = Array.isArray(response) ? response : response.data;

      this.currentPage = 1;
      this.pageSize = 10;
      this.totalPages = 1;
      this.totalRecords = data.length;
    }),
    map((response: any) => Array.isArray(response) ? response : response.data)
  );
}


      

     onPageChange(page: number) {
       this.currentPage = page;
       this.loadProducts();
     }

     editProduct(id: number) {
       this.router.navigate(['/products/edit', id]);
     }

// deleteProduct(id: number) {
//   if (confirm('Are you sure you want to delete this product?')) {
//     this.productService.delete(id).subscribe({
//       next: () => {
//         this.loadProducts().subscribe({
//           next: (products) => {
//             this.products$ = this.loadProducts(); // refresh the list in UI
//           }
//         });
//       },
//       error: (error: any) => {
//         console.error('Error deleting product:', error);
//       }
//     });
//   }
// }

deleteProduct(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.delete(id).subscribe({
      next: () => {
        //setTimeout(() => {
          //this.loadProducts(); 
          window.location.reload();

        //}, 3000);
      },
      error: (error: any) => console.error('Error deleting product:', error)
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