import { Routes } from '@angular/router';
import { CategoryListComponent } from './component/category-list/category-list';
import { CategoryFormComponent } from './component/category-form/category-form';
import { ProductListComponent } from './component/product-list/product-list';
import { ProductFormComponent } from './component/product-form/product-form';

export const routes: Routes = [     { path: '', redirectTo: '/categories', pathMatch: 'full' },
     { path: 'categories', component: CategoryListComponent },
     { path: 'categories/new', component: CategoryFormComponent },
     { path: 'categories/edit/:id', component: CategoryFormComponent },
     { path: 'products', component: ProductListComponent },
     { path: 'products/new', component: ProductFormComponent },
     { path: 'products/edit/:id', component: ProductFormComponent }];


