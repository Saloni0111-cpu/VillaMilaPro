import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-auth-carousel',
  standalone: true,
  templateUrl: './auth-carousel.component.html',
  styleUrl: './auth-carousel.component.scss'
})
export class AuthCarouselComponent implements AfterViewInit {

  @Input() images: string[] = [];
  @Input() interval = 3000;
  @Input() indicatorColor: string = '#8dd3bb';

  carouselId = `authCarousel-` + Math.random().toString(36).substring(2, 9);

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const carouselElement = this.el.nativeElement.querySelector('.carousel');

    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: this.interval,
        ride: 'carousel',
        pause: false,
        wrap: true
      })
    }
  }

}
