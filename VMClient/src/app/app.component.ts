// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { HomeComponent } from './home/home/home.component';
// import { FooterComponent } from './home/footer/footer.component';
// import { HeaderComponent } from './home/header/header.component';
//   import { VillaSummaryComponent } from './home/villas/villa-details/villa-summary/villa-summary.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, HomeComponent, FooterComponent, HeaderComponent, VillaSummaryComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   title = 'villa-milla';
// }




import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
// import { NavbarComponent } from './navbar/navbar.component';
// import { FooterComponent } from './footer/footer.component';
// import content from './content.json';
import { HomeComponent } from './home/home/home.component';
import { FooterComponent } from './home/footer/footer.component';
import { HeaderComponent } from './home/header/header.component';
import { VillaSummaryComponent } from './home/villas/villa-details/villa-summary/villa-summary.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    // NavbarComponent,
    // FooterComponent,
    // HomeComponent,
    FooterComponent,
    HeaderComponent,
    // VillaSummaryComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  showSplash = false;
  showLayout = true;
  // content = content;

  @ViewChild('myModal', { static: false })
  modalElement!: ElementRef<HTMLElement>;
  @ViewChild('secondModal', { static: false })
  secondModalElement!: ElementRef<HTMLElement>;
  @ViewChild('openSecondModal', { static: false })
  openSecondModalButton!: ElementRef<HTMLButtonElement>;
  private firstModalInstance!: any;
  private secondModalInstance!: any;
  @ViewChild('myInput') inputElement!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const justLoggedIn = localStorage.getItem('justLoggedIn');

      if (justLoggedIn === 'true') {
        this.showSplash = true;
        localStorage.removeItem('justLoggedIn');

        setTimeout(() => {
          this.showSplash = false;
          this.cdRef.detectChanges();
        }, 3000);
      }
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const authRoutes = [
          '/login',
          '/signup',
          '/forgotpassword',
          '/verifycode',
          '/setpassword'
        ];

        this.showLayout = !authRoutes.some(route =>
          event.urlAfterRedirects.startsWith(route)
        );
      });
  }

  ngAfterViewInit(): void { }
}

//   async ngAfterViewInit(): Promise<void> {
//     if (isPlatformBrowser(this.platformId)) {
//       const { Modal } = await import('bootstrap');
//       this.firstModalInstance = new Modal(this.modalElement.nativeElement);
//       this.secondModalInstance = new Modal(this.secondModalElement.nativeElement);

//       const Swiper = (await import('swiper')).default;
//       const swiper = new Swiper('.swiper', {
//         loop: true,
//         autoplay: {
//           delay: 3000,
//         },
//         pagination: {
//           el: '.swiper-pagination',
//         },
//       });
//     }
//   }



//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       const splashShown = sessionStorage.getItem('splashShown');
//       if (splashShown) {
//         this.showSplash = false;
//       } else {
//         this.showSplash = true;
//         sessionStorage.setItem('splashShown', 'true');
//         setTimeout(() => {
//           this.showSplash = false;
//         }, 3000);
//       }
//     }
//   }
//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       const justLoggedIn = localStorage.getItem('justLoggedIn');

//       if (justLoggedIn === 'true') {
//         this.showSplash = true;
//         localStorage.removeItem('justLoggedIn');
//         setTimeout(() => {
//           this.showSplash = false;
//           this.cdRef.detectChanges();
//         }, 3000);
//       } else {
//         this.showSplash = false;
//       }
//     }
//   }
// }
