import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //private apiUrl = '/api/products';
  private apiUrlList = 'http://localhost:8000/api/products/list';
  private apiUrlGet = 'http://localhost:8000/api/products/get';
  private apiUrlCreate = 'http://localhost:8000/api/products/create';
  private apiUrlUpdate = 'http://localhost:8000/api/products/update';
  private apiUrlDelete = 'http://localhost:8000/api/products/delete';

  constructor(private http: HttpClient) {}

  // getAll(page: number = 1, pageSize: number = 10): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  // }

  
  getAll(): Observable<any> {
    return this.http.post<any>(this.apiUrlList, {});
  }

  getById(id: number): Observable<Product> {
    return this.http.post<Product>(this.apiUrlGet, { id });
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrlCreate, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrlUpdate, { id, ...product });
  }

  delete(id: number): Observable<void> {
    return this.http.post<void>(this.apiUrlDelete, { id });
  }
}
