import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
   import { FormBuilder, FormGroup, Validators } from '@angular/forms';
   import { ActivatedRoute, Router } from '@angular/router';
   import { Category } from '../../models/category.model';
import { CategoryService } from '../../service/category.service';

   @Component({
     selector: 'app-category-form',
     imports: [CommonModule, ReactiveFormsModule],
     templateUrl: './category-form.html',
     standalone: true,
   })
   export class CategoryFormComponent implements OnInit {
     categoryForm: FormGroup;
     isEditMode = false;
     categoryId?: number;
     loading = false;

     constructor(
       private fb: FormBuilder,
       private categoryService: CategoryService,
       private route: ActivatedRoute,
       private router: Router
     ) {
       this.categoryForm = this.fb.group({
         name: ['', [Validators.required, Validators.maxLength(255)]],
         description: ['']
       });
     }

     ngOnInit() {
       const id = this.route.snapshot.paramMap.get('id');
       if (id) {
         this.isEditMode = true;
         this.categoryId = +id;
         this.loadCategory();
       }
     }

     loadCategory() {
       if (this.categoryId) {
         this.loading = true;
         this.categoryService.getById(this.categoryId).subscribe({
           next: (category: Category) => {
             this.categoryForm.patchValue(category);
             this.loading = false;
           },
           error: (error: any) => {
             console.error('Error loading category:', error);
             this.loading = false;
           }
         });
       }
     }

     onSubmit() {
       if (this.categoryForm.valid) {
         const categoryData: Category = this.categoryForm.value;
         
         if (this.isEditMode && this.categoryId) {
           this.categoryService.update(this.categoryId, categoryData).subscribe({
             next: () => {
               this.router.navigate(['/categories']);
             },
             error: (error: any) => {
               console.error('Error updating category:', error);
             }
           });
         } else {
           this.categoryService.create(categoryData).subscribe({
             next: () => {
               this.router.navigate(['/categories']);
             },
             error: (error: any) => {
               console.error('Error creating category:', error);
             }
           });
         }
       }
     }

     onCancel() {
       this.router.navigate(['/categories']);
     }
   }