import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  private apiUrl: string = "https://localhost:444/pfm/image/";

  constructor(private httpClient: HttpClient) { }

  getPictureById(id: string): Observable<Blob> {
    return this.httpClient.get(this.apiUrl + id, { responseType: 'blob' });
  }
}
