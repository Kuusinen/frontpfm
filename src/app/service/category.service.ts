import { Injectable } from '@angular/core';
import { Category } from '../model/category';
import { HttpClient, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../model/product';
import { environement } from '../model/environement';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl: string = environement.apiUrl +"pfm/api";

  private categoryUrl: string = "/category";

  private removeUrl: string = "/remove";

  private idUrl: string = "/id";

  private nameUrl: string = "/name";

  constructor(private httpClient: HttpClient) { }

  getAllCategory(): Observable<HttpResponse<Category[]>> {
    const fullCategoryUrl = this.apiUrl + this.categoryUrl;
    return this.httpClient.get<Category[]>(fullCategoryUrl, { observe: 'response' });
  }

  getAllSubCategory(category: Category): Observable<HttpResponse<Category[]>> {
    const fullCategoryUrl = this.apiUrl + this.categoryUrl + "/" + category.uuid;
    return this.httpClient.get<Category[]>(fullCategoryUrl, { observe: 'response' });
  }

  addCategory(category: Category): Observable<HttpResponse<Category>> {
    const fullCategoryUrl = this.apiUrl + this.categoryUrl;
    return this.httpClient.post<Category>(fullCategoryUrl, category, { observe: 'response' });
  }

  deleteCategory(category: Category): Observable<HttpResponse<Category>>{
    const fullCategoryUrl = this.apiUrl + this.categoryUrl + this.removeUrl;
    return this.httpClient.delete<Category>(fullCategoryUrl, { observe: 'response', body: category});
  }

  getCategoryById(idCategory: string):Observable<HttpResponse<Category>> {
    const fullCategoryUrl = this.apiUrl + this.categoryUrl+ this.idUrl + "/" + idCategory;
    return this.httpClient.get<Category>(fullCategoryUrl, { observe: 'response' });
  }

  getCategoryByName(categoryName: string):Observable<HttpResponse<Category>> {
    const fullCategoryUrl = this.apiUrl + this.categoryUrl+ this.nameUrl + "/" + categoryName;
    return this.httpClient.get<Category>(fullCategoryUrl, { observe: 'response' });
  }
}