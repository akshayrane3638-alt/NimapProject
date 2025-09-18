import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
   import { Router } from '@angular/router';
   import { Category } from '../../models/category.model';
import { CategoryService } from '../../service/category.service';

   @Component({
     selector: 'app-category-list',
     templateUrl: './category-list.html',
     standalone: true,
    imports: [CommonModule]
   })
   export class CategoryListComponent implements OnInit {
     categories: Category[] = [];
     loading = false;

     constructor(
       private categoryService: CategoryService,
       private router: Router
     ) {}

     ngOnInit() {
       this.loadCategories();
     }

     loadCategories() {
       this.loading = true;
       this.categoryService.getAll().subscribe({
         next: (data: Category[]) => {
           this.categories = data;
           this.loading = false;
         },
         error: (error: any) => {
           console.error('Error loading categories:', error);
           this.loading = false;
         }
       });
     }

     editCategory(id: number) {
       this.router.navigate(['/categories/edit', id]);
     }

     deleteCategory(id: number) {
       if (confirm('Are you sure you want to delete this category?')) {
         this.categoryService.delete(id).subscribe({
           next: () => {
             this.loadCategories();
           },
           error: (error: any) => {
             console.error('Error deleting category:', error);
           }
         });
       }
     }
   }