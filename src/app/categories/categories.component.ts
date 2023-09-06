import { Component, ComponentFactoryResolver, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Category } from '../model/category';
import { CategoryService } from '../service/category.service';
import { PictureService } from '../service/picture.service';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { Product } from '../model/product';
import { Router } from '@angular/router';
import { ProductComponent } from '../product/product.component';
import { ProductService } from '../service/product.service';

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

  allProducts: Product[] = [];

  private newCategory!: Category;

  imageById: Map<string | undefined, string> = new Map<string, string>();

  parentCategory!: Category | null;

  productMode: boolean = false;

  categoryMode: boolean = true;

  @ViewChild('title')
  private title!: ElementRef;

  constructor(private categoryService: CategoryService, private pictureService: PictureService, private authService: AuthService,
    private renderer: Renderer2, private router: Router, private productService: ProductService) {
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
    Swal.fire({
      title: 'Voulez-vous supprimer cette catégorie, ses sous catégories et les articles associés ?',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)",
      cancelButtonColor: "rgb(194, 208, 185)"
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(category).subscribe({
          next: (deletedCarouselElementResponse) => {
            if (deletedCarouselElementResponse.ok) {
              this.allCat.splice(this.allCat.indexOf(category), 1);
              Swal.fire({ title: 'Suppression', html: "La catégorie, ses sous catégories et les articles associés ont bien été supprimés", icon: 'success', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
            }
          },
        });
      }
    })
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
                    this.updateMode();
                  }
                }
              });
            }
          });
          this.updateMode();
        }
      },
    });

    this.renderer.setStyle(this.title.nativeElement, "text-decoration", "underline");

    this.productService.getAllProductsByCategory(category).subscribe({
      next: productResponse => {
        if (productResponse.ok && productResponse.body != null) {
          productResponse.body.forEach(product => {
            if (product.uuidsImages != undefined && product.uuidsImages.at(0) != undefined) {
              this.pictureService.getPictureById(product.uuidsImages.at(0)).subscribe(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                  const byteImage = reader.result as string;
                  if (product.uuidsImages.at(0) != undefined) {
                    this.imageById.set(product.uuidsImages.at(0), byteImage);
                    this.allProducts.push(product);
                    this.updateMode();
                  }
                }
              });
            }
          })
          this.updateMode();
        }
      }
    })
  }

  initCategory(category: Category | null) {
    if (category != this.parentCategory) {
      if (category == null) {
        this.parentCategory = category;
        this.allCat = [];
        this.allProducts = [];
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
                        this.updateMode();
                      }
                    }
                  });
                }
              });
              this.updateMode();
            }
          },
        });
      } else {
        this.breadCrumbCat.splice(this.breadCrumbCat.indexOf(category) + 1);
        this.parentCategory = category;
        this.allCat = [];
        this.allProducts = [];

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
                        this.updateMode();
                      }
                    }
                  });
                }
              });
              this.updateMode();
            }
          },
        });

        this.renderer.setStyle(this.title.nativeElement, "cursor", "pointer");
        this.renderer.setStyle(this.title.nativeElement, "text-decoration", "underline");
      }
    }
  }

  private updateMode(): void {
    this.productMode = this.allCat.length == 0;
    this.categoryMode = this.allProducts.length == 0;
  }

  openProduct(product: Product | null) {
    if (product == null) {
      this.router.navigate(['/product', this.parentCategory?.uuid, '']);
    } else {
      this.router.navigate(['/product', this.parentCategory?.uuid, product.uuid]);
    }
  }
}