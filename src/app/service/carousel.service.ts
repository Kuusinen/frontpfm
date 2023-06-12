import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { carouselElement } from '../model/carouselElement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private apiUrl: string = "https://localhost:444/pfm/api/carousel";

  constructor(private httpClient: HttpClient) { }

  saveCarouselElement(imgCarousel: carouselElement): Observable<HttpResponse<carouselElement>> {
    return this.httpClient.post<carouselElement>(this.apiUrl, imgCarousel, { observe: 'response' });
  }

  getCarouselElement(): Observable<HttpResponse<carouselElement[]>> {
    return this.httpClient.get<carouselElement[]>(this.apiUrl, { observe: 'response' });
  }
}
