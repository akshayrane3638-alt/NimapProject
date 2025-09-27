import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.apiUrl}/list`, {});
  }


  getById(id: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get`, { id: id });
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create`, category);
  }

update(id: number, category: Category): Observable<Category> {
  const body = { id, ...category };
  return this.http.post<Category>(`${this.apiUrl}/update`, body);
}

 delete(id: number): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/delete`, { id }); // remove the extra }
}

}
