import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { carouselElement } from '../model/carouselElement';
import { CarouselService } from '../service/carousel.service';
import { PictureService } from '../service/picture.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  private file!: File;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;

  isLog!: boolean;

  carouselImages: carouselElement[] = [];

  imgCarousel!: carouselElement;

  imageById: Map<string, string> = new Map<string, string>();

  constructor(private authService: AuthService, private carouselService: CarouselService, private pictureService: PictureService) {
  }

  ngOnInit(): void {
    this.isLog = !this.authService.isTokenExpired();

    this.carouselService.getCarouselElement().subscribe({
      next: carouselElementsResponse => {
        if (carouselElementsResponse.ok && carouselElementsResponse.body != null) {

          carouselElementsResponse.body.forEach(element => {
            if (element.imageUuid != undefined) {
              this.pictureService.getPictureById(element.imageUuid).subscribe(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                  const byteImage = reader.result as string;
                  if (element.imageUuid != undefined) {
                    this.imageById.set(element.imageUuid, byteImage);
                    this.carouselImages.push(element);
                  }
                }
              });
            }

          });
        }
      }
    });
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused && (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  importImage(event: any): void {
    const reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      const byteImage = reader.result as string;
      this.imgCarousel = new carouselElement();
      this.imgCarousel.imageDescription = "";
      this.pictureService.savePicture(this.file).subscribe({
        next: (response) => {
          if (response.ok && response.body != null) {
            this.imgCarousel.imageUuid = response.body.message;
            this.imageById.set(response.body.message, byteImage);
            this.carouselImages.push(this.imgCarousel);
          }
        }
      });
    }
  }

  deleteCarouselImg(img: carouselElement): void {
    this.carouselImages.splice(this.carouselImages.indexOf(img), 1);
    this.carouselService.deleteCarouselElement(img);
  }

  onLostFocus(carouselElement: carouselElement): void {
    this.carouselService.saveCarouselElement(carouselElement).subscribe({
      next: response => {
        if(response.ok){
          console.log("nouvelle image dans le carrousel");
        }
      }
    });
  }

  loadImage(id?: string): string {
    if (id != undefined) {
      return this.imageById.get(id) as string;
    } else {
      return "";
    }
  }
}
