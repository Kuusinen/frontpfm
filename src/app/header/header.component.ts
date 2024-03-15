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
  }

  disableHamburgerMenu()
  {
    if( !this.isCollapsed){
      this.isCollapsed = true
    }
  }
}
