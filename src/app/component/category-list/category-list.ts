import { Component, OnInit, OnDestroy, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoryListComponent implements OnInit, OnDestroy, AfterViewInit {
  categories = signal<any[]>([]);
  loading = signal<boolean>(false);
  showContent = signal<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    // Don't load data in ngOnInit to avoid SSR issues
  }

  ngAfterViewInit() {
    // Load data after view is fully initialized
    setTimeout(() => {
      this.showContent.set(true);
      this.loadCategories();
    }, 50);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    if (this.loading()) return;
    
    this.loading.set(true);
    
    this.categoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categories.set(data);
          this.loading.set(false);
        },
        error: (err: any) => {
          this.loading.set(false);
          console.error('Error loading categories:', err);
        }
      });
  }

  editCategory(id: any) {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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