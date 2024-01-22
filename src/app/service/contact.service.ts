import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environement } from '../model/environement-prod';
import { Email } from '../model/email';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = environement.apiUrl;
  private mailIUrl = "pfm/api/email"

  constructor(private http: HttpClient) {
  }

  sendEmail(email: Email): Observable<HttpResponse<any>> {
    const fullContactUrl = this.apiUrl + this.mailIUrl;
    console.log(fullContactUrl);
    return this.http.post<Email>(fullContactUrl, email, { observe: 'response' });
  }
}
