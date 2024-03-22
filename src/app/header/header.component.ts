import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger("change", [
      state('stable', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('onChange', style({
        opacity: 1,
        transform: 'translateY(0px)'
      })),
      transition('stable => onChange', [
        animate('.5s ease-in')
      ])
    ])]
})
export class HeaderComponent {

  isCollapsed!: boolean

  state: string = "onChange"

  imageSource: string = "assets/img/pfm_title_c.png"

  @ViewChild('title')
  private title!: ElementRef;

  constructor(private renderer: Renderer2) {
    this.isCollapsed = true;

    this.renderer.listen('window', 'scroll', (e) => {
      if ((e.target.scrollingElement as Element).scrollTop > 300) {
        this.changeImage(true)
      } else {
        this.changeImage(false)
      }
    });
  }

  changeImage(reduce: boolean) {
    const oldSource = this.imageSource;
    if (reduce) {
      this.imageSource = "assets/img/pfm_title_r.png"
    } else {
      this.imageSource = "assets/img/pfm_title_c.png"
    }

    if(oldSource != this.imageSource){
      this.state= "stable"
    }
  }

  disableHamburgerMenu() {
    if (!this.isCollapsed) {
      this.isCollapsed = true
    }
  }

  onDoneEvent(event: AnimationEvent){
    if(event.toState === 'stable'){
      this.state= "onChange"
    }
  }
}
