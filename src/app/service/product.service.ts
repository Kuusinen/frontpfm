import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../model/category';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = "https://localhost:444/pfm/api";

  private productUrl: string = "/product";

  private idUrl: string = "/id";

  constructor(private httpClient: HttpClient) { }

  getAllProductsByCategory(category: Category): Observable<HttpResponse<Product[]>>{
    const fullProductUrl = this.apiUrl + this.productUrl + "/" + category.uuid;
    return this.httpClient.get<Product[]>(fullProductUrl, {observe: 'response'});
  }

  getProductById(id: string): Observable<HttpResponse<Product>>{
    const fullProductUrl = this.apiUrl + this.productUrl + this.idUrl + "/" + id;
    return this.httpClient.get<Product>(fullProductUrl, {observe: 'response'});
  }

  addProduct(product: Product): Observable<HttpResponse<Product>>{
    const fullProductUrl = this.apiUrl + this.productUrl;
    return this.httpClient.post<Product>(fullProductUrl, product, {observe: 'response'});
  }
}
