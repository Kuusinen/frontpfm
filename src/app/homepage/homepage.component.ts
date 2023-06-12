import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { carouselElement } from '../model/carouselElement';

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

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLog = !this.authService.isTokenExpired();

    let images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);
    let i = 1;
    for (let img of images) {
      this.imgCarousel = new carouselElement();
      this.imgCarousel.byteImage = img;
      this.imgCarousel.textDescription = "My slide " + i + " title";
      this.carouselImages.push(this.imgCarousel);
      i = i + 1;
    }
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
      this.imgCarousel.byteImage = byteImage;
      this.imgCarousel.textDescription = "";
      this.carouselImages.push(this.imgCarousel);
    }
  }

  deleteCarouselImg(img: carouselElement): void {
    this.carouselImages.splice(this.carouselImages.indexOf(img), 1);
  }
}
