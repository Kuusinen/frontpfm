import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { User } from '../model/User';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  user = new User();

  @ViewChild('id')
  private id!: ElementRef;

  @ViewChild('password')
  private password!: ElementRef;

  constructor(private authService: AuthService, private renderer: Renderer2, private router: Router) {
  }

  loggedin(): void {
    this.authService.login(this.user).subscribe({
      next: (data) => {
        let jwToken = data.headers.get('Authorization')!;
        this.authService.saveToken(jwToken);
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.renderer.setStyle(this.id.nativeElement, "border", "2px inset red");
        this.renderer.setStyle(this.password.nativeElement, "border", "2px inset red");
      }
    });
  }

  loggedOut(): void {
    this.authService.logout();
    this.router.navigate(['/homepage']);
  }

  isLogged() {
    return !this.authService.isTokenExpired();
  }
}
