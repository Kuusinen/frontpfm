import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Category } from '../model/category';
import { CategoryService } from '../service/category.service';
import { PictureService } from '../service/picture.service';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private file!: File;

  isLog!: boolean;

  allCat: Category[] = [];

  breadCrumbCat: Category[] = [];

  private newCategory!: Category;

  imageById: Map<string, string> = new Map<string, string>();

  parentCategory!: Category | null;

  productMode: boolean = false;

  categoryMode: boolean = true;

  @ViewChild('title')
  private title!: ElementRef;

  constructor(private categoryService: CategoryService, private pictureService: PictureService, private authService: AuthService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.isLog = !this.authService.isTokenExpired();

    this.categoryService.getAllCategory().subscribe({
      next: categoryResponse => {
        if (categoryResponse.ok && categoryResponse.body != null) {
          categoryResponse.body.forEach(category => {
            if (category.imageUuid != undefined) {
              this.pictureService.getPictureById(category.imageUuid).subscribe(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                  const byteImage = reader.result as string;
                  if (category.imageUuid != undefined) {
                    this.imageById.set(category.imageUuid, byteImage);
                    this.allCat.push(category);
                  }
                }
              });
            }
          });
        }
      },
    });
  }

  importImage(event: any): void {
    const reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      const byteImage = reader.result as string;
      this.newCategory = new Category();
      this.newCategory.name = "";
      if (this.parentCategory != null) {
        this.newCategory.category = this.parentCategory;
      }
      this.pictureService.savePicture(this.file).subscribe({
        next: (response) => {
          if (response.ok && response.body != null) {
            this.newCategory.imageUuid = response.body.message;
            this.imageById.set(response.body.message, byteImage);
            this.allCat.push(this.newCategory);
          }
        }
      });
    }
  }

  loadImage(id?: string): string {
    if (id != undefined) {
      return this.imageById.get(id) as string;
    } else {
      return "";
    }
  }

  onLostFocus(category: Category): void {
    this.categoryService.addCategory(category).subscribe({
      next: response => {
        if (response.ok) {
          Swal.fire({ title: 'Ajout', html: "La catégorie " + category.name + " a bien été ajoutée", icon: 'success', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
          this.productMode = false;
        }
      }
    });
  }

  deleteCategory(category: Category): void {
    this.allCat.splice(this.allCat.indexOf(category), 1);
    this.categoryService.deleteCategory(category).subscribe({
      next: (deletedCarouselElementResponse) => {
        if (deletedCarouselElementResponse.ok) {
          Swal.fire({ title: 'Suppression', html: "La catégorie et ses sous catégories a bien été supprimée", icon: 'success', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
        }
      },
    });
  }

  loadCategory(category: Category) {
    this.breadCrumbCat.push(category);
    this.parentCategory = category;
    this.allCat = [];

    this.categoryService.getAllSubCategory(category).subscribe({
      next: categoryResponse => {
        if (categoryResponse.ok && categoryResponse.body != null) {
          categoryResponse.body.forEach(category => {
            if (category.imageUuid != undefined) {
              this.pictureService.getPictureById(category.imageUuid).subscribe(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                  const byteImage = reader.result as string;
                  if (category.imageUuid != undefined) {
                    this.imageById.set(category.imageUuid, byteImage);
                    this.allCat.push(category);
                  }
                }
              });
            }
          });
        }
      },
    });

    this.renderer.setStyle(this.title.nativeElement, "text-decoration", "underline");

    if (this.allCat.length == 0) {
      this.productMode = true;
    }
  }

  initCategory(category: Category | null) {
    if (category == null) {
      this.parentCategory = category;
      this.allCat = [];
      this.breadCrumbCat = [];

      this.renderer.setStyle(this.title.nativeElement, "text-decoration", "none");

      this.categoryService.getAllCategory().subscribe({
        next: categoryResponse => {
          if (categoryResponse.ok && categoryResponse.body != null) {
            categoryResponse.body.forEach(category => {
              if (category.imageUuid != undefined) {
                this.pictureService.getPictureById(category.imageUuid).subscribe(file => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onload = () => {
                    const byteImage = reader.result as string;
                    if (category.imageUuid != undefined) {
                      this.imageById.set(category.imageUuid, byteImage);
                      this.allCat.push(category);
                    }
                  }
                });
              }
            });
          }
        },
      });
    } else {
      this.breadCrumbCat.splice(this.breadCrumbCat.indexOf(category) + 1);
      this.parentCategory = category;
      this.allCat = [];

      this.categoryService.getAllSubCategory(category).subscribe({
        next: categoryResponse => {
          if (categoryResponse.ok && categoryResponse.body != null) {
            categoryResponse.body.forEach(category => {
              if (category.imageUuid != undefined) {
                this.pictureService.getPictureById(category.imageUuid).subscribe(file => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onload = () => {
                    const byteImage = reader.result as string;
                    if (category.imageUuid != undefined) {
                      this.imageById.set(category.imageUuid, byteImage);
                      this.allCat.push(category);
                    }
                  }
                });
              }
            });
          }
        },
      });

      this.renderer.setStyle(this.title.nativeElement, "cursor", "pointer");
      this.renderer.setStyle(this.title.nativeElement, "text-decoration", "underline");

      if (this.allCat.length == 0) {
        this.productMode = true;
      }
    }
  }
}