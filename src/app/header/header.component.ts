import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isCollapsed!: boolean;

  @ViewChild('title')
  private title!: ElementRef;

  constructor(private renderer: Renderer2){
    this.isCollapsed = true;

    this.renderer.listen('window', 'scroll', (e) => {
      if ((e.target.scrollingElement as Element).scrollTop > 320) {
        this.renderer.setStyle(this.title.nativeElement, "font-size", "48px");
      } else {
        this.renderer.setStyle(this.title.nativeElement, "font-size", "64px");
      }
    });
  }
}
