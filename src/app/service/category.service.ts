import { Injectable } from '@angular/core';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories!: Category[];

  constructor() { 
    this.categories = [];
    for (let index = 0; index < 30; index++) {
      const cat: Category = {
        uuid: "" + index,
        name: "Catégorie " + index};

      this.categories.push(cat);
    }
  }

  public getCategories(): Category[]{
    return this.categories;
  }
}

