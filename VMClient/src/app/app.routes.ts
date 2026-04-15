import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { AboutComponent } from './home/about/about.component';
import { AccountComponent } from './home/account/account/account.component';
import { BookingsComponent } from './home/account/bookings/bookings.component';
import { ProfileComponent } from './home/account/profile/profile.component';
import { SavedComponent } from './home/account/saved/saved.component';
import { WalletComponent } from './home/account/wallet/wallet.component';
import { BlogDetailsComponent } from './home/blogs/blog-details/blog-details.component';
import { BlogPageComponent } from './home/blogs/blog-page/blog-page.component';
import { ContactComponent } from './home/contact/contact.component';
import { HomeComponent } from './home/home/home.component';
import { VillaDetailsComponent } from './home/villas/villa-details/villa-details.component';
import { VillaSummaryComponent } from './home/villas/villa-details/villa-summary/villa-summary.component';
import { VillaListComponent } from './home/villas/villa-list/villa-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Default redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Public routes

  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },

  // ✅ VILLAS
  { path: 'villas', component: VillaListComponent },

  // ✅ DETAILS (WITH ID ONLY)
  { path: 'villa-details/:id', component: VillaDetailsComponent },

  // ✅ SUMMARY (FIXED)
  { path: 'villa-summary/:id', component: VillaSummaryComponent },

  // ACCOUNT

  // Villas ← :id routes BEFORE wildcard
  { path: 'villas', component: VillaListComponent },
  { path: 'villa-details/:id', component: VillaDetailsComponent },  // ← fixed
  { path: 'villa-summary/:id', component: VillaSummaryComponent },  // ← fixed

  // Blogs
  { path: 'blogs', component: BlogPageComponent },
  { path: 'blogs/create', component: BlogDetailsComponent },
  { path: 'blogs/:id', component: BlogDetailsComponent },

  // Account (Protected)

  {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'saved', component: SavedComponent },
    ]
  },


  // AUTH

  // Auth Routes

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'forgotpassword',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verifycode',
    loadComponent: () =>
      import('./auth/verify-code/verify-code.component').then(m => m.VerifyCodeComponent)
  },
  {
    path: 'setpassword',
    loadComponent: () =>
      import('./auth/set-a-password/set-a-password.component').then(m => m.SetAPasswordComponent)
  },


  // PAYMENT

  // Payments

  {
    path: 'paymentsummary',
    loadComponent: () =>
      import('./home/payment/payment-summary/payment-summary.component').then(m => m.PaymentSummaryComponent)
  },
  {
    path: 'paymentmethod',
    loadComponent: () =>
      import('./home/payment/payment-method/payment-method.component').then(m => m.PaymentMethodComponent)
  },


  // BLOGS
  {
    path: 'blogs',
    loadComponent: () =>
      import('./home/blogs/blog-page/blog-page.component').then(m => m.BlogPageComponent)
  },

  {
    path: 'blogs/:id',
    loadComponent: () =>
      import('./home/blogs/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
  },

  // Wildcard MUST always be last
  { path: '**', redirectTo: 'home' },
];

