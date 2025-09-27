import { Component, OnInit, OnDestroy, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../service/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-form.html',
})
export class CategoryFormComponent implements OnInit, AfterViewInit, OnDestroy {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId?: number;

  loading = signal<boolean>(false);
  showContent = signal<boolean>(false);
  private destroy$ = new Subject<void>();

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
    }
    // No data fetching here for SSR
  }

  ngAfterViewInit() {
    // Delay rendering to client to fix SSR hydration
    setTimeout(() => {
      this.showContent.set(true);
      if (this.isEditMode && this.categoryId) {
        this.loadCategory();
      }
    }, 50);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategory() {
    if (!this.categoryId) return;

    this.loading.set(true);
    this.categoryService.getById(this.categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (category: Category) => {
          this.categoryForm.patchValue(category);
          this.loading.set(false);
        },
        error: (error: any) => {
          console.error('Error loading category:', error);
          this.loading.set(false);
        }
      });
  }

  onSubmit() {
    if (!this.categoryForm.valid) return;

    const categoryData: Category = this.categoryForm.value;

    this.loading.set(true);
    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, categoryData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigate(['/categories']),
          error: (error: any) => {
            console.error('Error updating category:', error);
            this.loading.set(false);
          }
        });
    } else {
      this.categoryService.create(categoryData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigate(['/categories']),
          error: (error: any) => {
            console.error('Error creating category:', error);
            this.loading.set(false);
          }
        });
    }
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
}
