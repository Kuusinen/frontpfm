import { Component } from '@angular/core';
import { Category } from '../model/category';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  allCat!: Category[];

  constructor(categoryService: CategoryService) {
    this.allCat = categoryService.getCategories();
  }
  
}
