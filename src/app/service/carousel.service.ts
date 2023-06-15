import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarouselElement } from '../model/carouselElement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private apiUrl: string = "https://localhost:444/pfm/api/carousel";

  constructor(private httpClient: HttpClient) { }

  saveCarouselElement(imgCarousel: CarouselElement): Observable<HttpResponse<CarouselElement>> {
    return this.httpClient.post<CarouselElement>(this.apiUrl, imgCarousel, { observe: 'response' });
  }

  getCarouselElement(): Observable<HttpResponse<CarouselElement[]>> {
    return this.httpClient.get<CarouselElement[]>(this.apiUrl, { observe: 'response' });
  }

  deleteCarouselElement(carouselElement: CarouselElement): Observable<HttpResponse<CarouselElement>> {
    return this.httpClient.delete<CarouselElement>(this.apiUrl + "/remove", { observe: 'response', body: carouselElement });
  }
}
