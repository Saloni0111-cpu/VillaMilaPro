import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  @ViewChildren('reviewCarousel') reviewTracks!: QueryList<ElementRef>;
  activeReviewIndex = 0;

  reviews = [
    {
      image: 'assets/lonavala.webp',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error, est non. Saepe natus harum quo vitae explicabo est ipsum esse rerum earum, aliquid alias consequuntur voluptatem mollitia distinctio rem culpa?'
    },
    {
      image: 'assets/HomeImages/ExploreByDestination/whyus.svg',
      text: 'Amazing experience! The booking was seamless and the villa exceeded our expectations. Highly recommend for any weekend getaway.'
    },
    {
      image: 'assets/HomeImages/ExploreByDestination/whyus2.svg',
      text: 'The best service we have ever received. The staff was cooperative and the property was clean and beautiful. Will definitely book again.'
    }
  ];

  scrollReviews(direction: number) {
    const maxIndex = this.reviews.length - 1;

    if (direction < 0) {
      this.activeReviewIndex = this.activeReviewIndex > 0 ? this.activeReviewIndex - 1 : maxIndex;
    } else {
      this.activeReviewIndex = this.activeReviewIndex < maxIndex ? this.activeReviewIndex + 1 : 0;
    }

    this.syncReviewScroll();
  }

  private syncReviewScroll() {
    if (this.reviewTracks && this.reviewTracks.first) {
      const scrollAmount = this.reviewTracks.first.nativeElement.clientWidth;
      this.reviewTracks.first.nativeElement.scrollTo({
        left: this.activeReviewIndex * scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
