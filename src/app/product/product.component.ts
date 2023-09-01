import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { PictureService } from '../service/picture.service';
import { CategoryService } from '../service/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private file!: File;

  product!: Product;

  creationMode!: boolean;

  isLog!: boolean;

  productImage: string[] = [];

  productLoaded!: Promise<Boolean>;

  imageView: string = "";

  @ViewChild('firstImage')
  private firstImage!: ElementRef;

  constructor(private productService: ProductService, private route: ActivatedRoute, private authService: AuthService, private pictureService: PictureService,
    private categoryService: CategoryService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.isLog = !this.authService.isTokenExpired();

    const idProduct = this.route.snapshot.paramMap.get('idProduct');
    this.creationMode = idProduct == null || idProduct == "";

    if (idProduct != null && idProduct != "") {
      this.productService.getProductById(idProduct).subscribe({
        next: productResponse => {
          if (productResponse.ok && productResponse.body != null) {
            this.product = productResponse.body;
            this.product.uuidsImages.forEach(uuidImage => {
              this.pictureService.getPictureById(uuidImage).subscribe(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                  const byteImage = reader.result as string;
                  this.productImage.push(byteImage);
                  if (this.imageView == "") {
                    this.imageView = byteImage;
                  }
                }
              });
            })
          }
        }
      })
    } else {
      this.product = new Product();
      this.product.title = "";
      this.product.body = "";
      this.product.uuidsImages = [];
    }

    const idCategory = this.route.snapshot.paramMap.get('idCategory');
    if (idCategory != null) {
      this.categoryService.getCategoryById(idCategory).subscribe({
        next: categoryResponse => {
          if (categoryResponse.ok && categoryResponse.body != null) {
            this.product.category = categoryResponse.body;
            this.productLoaded = Promise.resolve(true);
          }
        }
      });
    }
  }

  importImage(event: any): void {
    const reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      const byteImage = reader.result as string;
      this.pictureService.savePicture(this.file).subscribe({
        next: (response) => {
          if (response.ok && response.body != null) {
            this.product.uuidsImages.push(response.body.message);
            this.productImage.push(byteImage);
            console.log(this.productImage);
            if (this.imageView == "") {
              this.imageView = byteImage;
            }
          }
        }
      });
    }
  }

  changeImg(img: string) {
    this.imageView = img;
  }

  createProduct() {
    if (this.product.title == "") {
      Swal.fire({ title: 'Ajout', html: "L'article doit avoir un titre défini pour être ajouté", icon: 'error', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
    } else {
      console.log(this.product);
      this.productService.addProduct(this.product).subscribe({
        next: productResponse => {
          if (productResponse.ok) {
            Swal.fire({ title: 'Ajout', html: "L'article " + this.product.title + " a bien été ajouté à la catégorie " + this.product.category.name + " !", icon: 'success', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
          }
        }
      })
    }
  }
}
