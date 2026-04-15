import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { VillaService } from '../../../services/villa.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  get destinations() {
    return this.destinationsRows.flat();
  }

  @ViewChildren('carousel') carouselTracks!: QueryList<ElementRef>;
  @ViewChildren('availableCarousel') availableTracks!: QueryList<ElementRef>;
  @ViewChildren('topRatedCarousel') topRatedTracks!: QueryList<ElementRef>;
  @ViewChildren('collectionCarousel') collectionTracks!: QueryList<ElementRef>;
  @ViewChildren('blogCarousel') blogTracks!: QueryList<ElementRef>;
  @ViewChildren('reviewCarousel') reviewTracks!: QueryList<ElementRef>;

  activeAvailableIndex = 0;
  activeTopRatedIndex = 0;
  activeCollectionIndex = 0;
  activeBlogIndex = 0;
  activeReviewIndex = 0;
  activeDestinationIndex = 0;

  villas: any[] = [];
  savedVillaIds: number[] = [];

  private collectionInterval: any;
  private blogInterval: any;

  constructor(
    private villaService: VillaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startAutoScroll();
    this.startBlogAutoScroll();
    this.loadVillas();
    if (this.authService.isLoggedIn()) {
      this.loadSavedVillas();
    }
  }

  loadVillas() {
    this.villaService.getVillas().subscribe({
      next: (data: any) => {
        const villasArray = data.results || data; // Handle both paginated and non-paginated
        this.villas = villasArray.map((v: any) => {
          let imageUrl = v.image || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            if (!imageUrl.startsWith('/')) {
              imageUrl = '/' + imageUrl;
            }
            imageUrl = 'http://localhost:8000' + imageUrl;
          }
          return {
            ...v,
            originalPrice: (v.price || 0) + 1000,
            discountedPrice: v.price || 0,
            city: v.location ? v.location.split(',')[0].trim() : 'Lonavala',
            image: imageUrl
          };
        });
      },
      error: (err: any) => console.error('Error fetching villas:', err)
    });
  }

  loadSavedVillas() {
    this.villaService.getSavedVillas().subscribe({
      next: (data: any[]) => {
        this.savedVillaIds = data.map((v: any) => v.id);
      },
      error: (err: any) => console.error('Error fetching saved villas:', err)
    });
  }

  isSaved(villaId: any): boolean {
    return this.savedVillaIds.includes(villaId);
  }

  toggleLike(villa: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to save villas');
      this.router.navigate(['/login']);
      return;
    }

    this.villaService.toggleSaveVilla(villa.id).subscribe({
      next: (res:any) => {
        if (this.isSaved(villa.id)) {
          this.savedVillaIds = this.savedVillaIds.filter(id => id !== villa.id);
        } else {
          this.savedVillaIds.push(villa.id);
        }
      },
      error: (err:any) => {
        console.error('Error toggling save:', err);
        alert('Failed to update saved villas');
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
    this.stopBlogAutoScroll();
  }

  startAutoScroll() {
    this.collectionInterval = setInterval(() => {
      this.scrollCollections(1);
    }, 5000);
  }

  stopAutoScroll() {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
    }
  }

  startBlogAutoScroll() {
    this.blogInterval = setInterval(() => {
      this.scrollBlogs(1);
    }, 6000); // Slightly different timing for visual variety
  }

  stopBlogAutoScroll() {
    if (this.blogInterval) {
      clearInterval(this.blogInterval);
    }
  }

  scrollCarousel(direction: number) {
    const scrollAmount = 400; // Adjusted for 2-row layout feel
    const maxIndex = 5; // Tracking 6 dots (0-5)

    if (direction < 0 && this.activeDestinationIndex > 0) {
      this.activeDestinationIndex--;
    } else if (direction > 0 && this.activeDestinationIndex < maxIndex) {
      this.activeDestinationIndex++;
    }

    this.syncScroll();
  }

  goToDestinationPage(index: number) {
    this.activeDestinationIndex = index;
    this.syncScroll();
  }

  private syncScroll() {
    const track = this.carouselTracks.first;
    if (track) {
      const scrollAmount = track.nativeElement.clientWidth + 16;
      this.carouselTracks.forEach(t => {
        t.nativeElement.scrollTo({
          left: this.activeDestinationIndex * scrollAmount,
          behavior: 'smooth'
        });
      });
    }
  }

  scrollVillas(type: 'available' | 'topRated', direction: number) {
    const villas = type === 'available' ? this.filteredVillas : this.topRatedVillas;
    
    const itemsPerView = 4;
    const maxIndex = Math.ceil(villas.length / itemsPerView) - 1;

    if (type === 'available') {
      if (direction < 0 && this.activeAvailableIndex > 0) {
        this.activeAvailableIndex--;
      } else if (direction > 0 && this.activeAvailableIndex < maxIndex) {
        this.activeAvailableIndex++;
      }
    } else {
      if (direction < 0 && this.activeTopRatedIndex > 0) {
        this.activeTopRatedIndex--;
      } else if (direction > 0 && this.activeTopRatedIndex < maxIndex) {
        this.activeTopRatedIndex++;
      }
    }

    this.syncVillaScroll(type);
  }

  goToVillaPage(type: 'available' | 'topRated', index: number) {
    if (type === 'available') {
      this.activeAvailableIndex = index;
    } else {
      this.activeTopRatedIndex = index;
    }
    this.syncVillaScroll(type);
  }

  get villaPages() {
    return Array(Math.ceil(this.villas.length / 4)).fill(0);
  }

  private syncVillaScroll(type: 'available' | 'topRated') {
    const tracks = type === 'available' ? this.availableTracks : this.topRatedTracks;
    const activeIndex = type === 'available' ? this.activeAvailableIndex : this.activeTopRatedIndex;

    if (tracks.first) {
      const scrollAmount = tracks.first.nativeElement.clientWidth + 24; // Including gap
      tracks.forEach(track => {
        track.nativeElement.scrollTo({
          left: activeIndex * scrollAmount,
          behavior: 'smooth'
        });
      });
    }
  }

  scrollCollections(direction: number) {
    const itemsPerView = 4;
    const maxIndex = Math.ceil(this.collections.length / itemsPerView) - 1;

    if (direction > 0) {
      if (this.activeCollectionIndex >= maxIndex) {
        this.activeCollectionIndex = 0;
      } else {
        this.activeCollectionIndex++;
      }
    } else {
      if (this.activeCollectionIndex <= 0) {
        this.activeCollectionIndex = maxIndex;
      } else {
        this.activeCollectionIndex--;
      }
    }
    this.syncCollectionScroll();

    // Reset interval on manual scroll
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  goToCollectionPage(index: number) {
    this.activeCollectionIndex = index;
    this.syncCollectionScroll();
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  get collectionPages() {
    return Array(Math.ceil(this.collections.length / 4)).fill(0);
  }

  private syncCollectionScroll() {
    if (this.collectionTracks && this.collectionTracks.first) {
      const scrollAmount = this.collectionTracks.first.nativeElement.clientWidth + 24; // Grid gap
      this.collectionTracks.first.nativeElement.scrollTo({
        left: this.activeCollectionIndex * scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollBlogs(direction: number) {
    const itemsPerView = 3;
    const maxIndex = Math.ceil(this.blogs.length / itemsPerView) - 1;

    if (direction > 0) {
      if (this.activeBlogIndex >= maxIndex) {
        this.activeBlogIndex = 0;
      } else {
        this.activeBlogIndex++;
      }
    } else {
      if (this.activeBlogIndex <= 0) {
        this.activeBlogIndex = maxIndex;
      } else {
        this.activeBlogIndex--;
      }
    }
    this.syncBlogScroll();

    // Reset interval on manual scroll
    this.stopBlogAutoScroll();
    this.startBlogAutoScroll();
  }

  goToBlogPage(index: number) {
    this.activeBlogIndex = index;
    this.syncBlogScroll();
    this.stopBlogAutoScroll();
    this.startBlogAutoScroll();
  }

  get blogPages() {
    return Array(Math.ceil(this.blogs.length / 3)).fill(0);
  }

  private syncBlogScroll() {
    if (this.blogTracks && this.blogTracks.first) {
      const scrollAmount = this.blogTracks.first.nativeElement.clientWidth + 24; // Gap
      this.blogTracks.first.nativeElement.scrollTo({
        left: this.activeBlogIndex * scrollAmount,
        behavior: 'smooth'
      });
    }
  }

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



  destinationsRows = [
    [
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
    ],
    [
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img8.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img9.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img10.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img11.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img12.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img13.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
      { name: 'Lonavala', img: 'assets/lonavala.webp' },
      { name: 'Alibaug', img: 'assets/HomeImages/ExploreByDestination/img1.svg' },
      { name: 'Coorg', img: 'assets/HomeImages/ExploreByDestination/img2.svg' },
      { name: 'Udaipur', img: 'assets/HomeImages/ExploreByDestination/img3.svg' },
      { name: 'Jaipur', img: 'assets/HomeImages/ExploreByDestination/img4.svg' },
      { name: 'Nashik', img: 'assets/HomeImages/ExploreByDestination/img5.svg' },
      { name: 'Ooty', img: 'assets/HomeImages/ExploreByDestination/img6.svg' },
      { name: 'Goa', img: 'assets/HomeImages/ExploreByDestination/img7.svg' },
    ]
  ];


  destinationPages = [0, 1, 2, 3, 4, 5];

  selectedLocation: string = 'All';

  locations = [
    'All',
    'Lonavala',
    'Varanasi',
    'Alibaug',
    'Karjat',
    'Explore More'
  ];

  selectLocation(location: string) {
    this.selectedLocation = location;
  }

  get filteredVillas() {
    if (this.selectedLocation === 'All' || this.selectedLocation === 'Explore More') {
      return this.villas;
    }
    return this.villas.filter(villa =>
      villa.city.toLowerCase() === this.selectedLocation.toLowerCase()
    );
  }

  get topRatedVillas() {
    return [...this.villas].sort((a, b) => b.rating - a.rating);
  }


  //why choose us data
  whyUs = [
    {
      image: "assets/HomeImages/Whyus/img1.svg",
      quantity: "200+",
      description: "Happy Guest"
    },
    {
      image: "assets/HomeImages/Whyus/img2.svg",
      quantity: "200+",
      description: "Villas & Farmhouse"
    },
    {
      image: "assets/HomeImages/Whyus/img3.svg",
      quantity: "200+",
      description: "Locations"
    },
    {
      image: "assets/HomeImages/Whyus/img4.svg",
      quantity: "200+",
      description: "Happy Clients"
    }

  ];

  //COLLECTION SECTION DATA

  collections = [
    {
      title: 'Monsoon Escape',
      image: 'assets/HomeImages/ExploreByCollection/img1.svg',
      count: '12,987 available'
    },
    {
      title: 'Winter Retreat',
      image: 'assets/HomeImages/ExploreByCollection/img2.svg',
      count: '8,452 available'
    },
    {
      title: 'Villas for wedding',
      image: 'assets/HomeImages/ExploreByCollection/img3.svg',
      count: '5,123 available'
    },
    {
      title: 'Beach Villas',
      image: 'assets/HomeImages/ExploreByCollection/img4.svg',
      count: '10,234 available'
    },
    {
      title: 'Monsoon Escape',
      image: 'assets/HomeImages/ExploreByCollection/img1.svg',
      count: '12,987 available'
    },
    {
      title: 'Winter Retreat',
      image: 'assets/HomeImages/ExploreByCollection/img2.svg',
      count: '8,452 available'
    },
    {
      title: 'Villas for wedding',
      image: 'assets/HomeImages/ExploreByCollection/img3.svg',
      count: '5,123 available'
    },
    {
      title: 'Beach Villas',
      image: 'assets/HomeImages/ExploreByCollection/img4.svg',
      count: '10,234 available'
    },
    {
      title: 'Monsoon Escape',
      image: 'assets/HomeImages/ExploreByCollection/img1.svg',
      count: '12,987 available'
    },
    {
      title: 'Winter Retreat',
      image: 'assets/HomeImages/ExploreByCollection/img2.svg',
      count: '8,452 available'
    },
    {
      title: 'Villas for wedding',
      image: 'assets/HomeImages/ExploreByCollection/img3.svg',
      count: '5,123 available'
    },
    {
      title: 'Beach Villas',
      image: 'assets/HomeImages/ExploreByCollection/img4.svg',
      count: '10,234 available'
    }
  ];

  blogs = [
    {
      title: 'Bill Walsh leadership lesson',
      image: 'assets/blog.svg',
      duration: '5 min read',
      description: 'Discover the secrets of transforming a struggling organization into a world-class winner.'
    },
    {
      title: 'The Art of Modern Architecture',
      image: 'assets/blog.svg',
      duration: '8 min read',
      description: 'Explore how modern villas are redefining luxury through sustainable and sleek design.'
    },
    {
      title: 'Monsoon Travel Essentials',
      image: 'assets/blog.svg',
      duration: '4 min read',
      description: 'Everything you need to pack for your next tropical getaway during the rainy season.'
    },
    {
      title: 'Bill Walsh leadership lesson',
      image: 'assets/blog.svg',
      duration: '5 min read',
      description: 'Discover the secrets of transforming a struggling organization into a world-class winner.'
    },
    {
      title: 'The Art of Modern Architecture',
      image: 'assets/blog.svg',
      duration: '8 min read',
      description: 'Explore how modern villas are redefining luxury through sustainable and sleek design.'
    },
    {
      title: 'Monsoon Travel Essentials',
      image: 'assets/blog.svg',
      duration: '4 min read',
      description: 'Everything you need to pack for your next tropical getaway during the rainy season.'
    },
    {
      title: 'Bill Walsh leadership lesson',
      image: 'assets/blog.svg',
      duration: '5 min read',
      description: 'Discover the secrets of transforming a struggling organization into a world-class winner.'
    },
    {
      title: 'The Art of Modern Architecture',
      image: 'assets/blog.svg',
      duration: '8 min read',
      description: 'Explore how modern villas are redefining luxury through sustainable and sleek design.'
    },
    {
      title: 'Monsoon Travel Essentials',
      image: 'assets/blog.svg',
      duration: '4 min read',
      description: 'Everything you need to pack for your next tropical getaway during the rainy season.'
    }
  ]

  faqs = [
    {
      question: 'How to book online?',
      answer: 'Our platform is easy to use. You can search your stay in the banner hero section and book directly.',
      expanded: false
    },
    {
      question: 'Request Custom Rooms?',
      answer: 'Yes! you can specify your requirements while booking.',
      expanded: false
    },
    {
      question: 'How to book offline',
      answer: 'You can call us on our toll free number and our team will assist you with the booking process.',
      expanded: false
    },
    {
      question: 'Can I request room with good view?',
      answer: 'Yes! you can specify your requirements while booking.',
      expanded: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }

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
  ]

}

