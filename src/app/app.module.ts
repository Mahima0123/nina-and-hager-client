import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from './components/alert/alert.service';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { FeaturesComponent } from './components/features/features.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FeatureProductsComponent } from './components/feature-products/feature-products.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/admin/dashboard/user-management/user-management.component';
import { ProductManagementComponent } from './pages/admin/dashboard/product-management/product-management.component';
import { ViewProductComponent } from './pages/admin/dashboard/view-product/view-product.component';
import { ProductsComponent } from './pages/products/products.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { UserResponseComponent } from './components/user-response/user-response.component';
import { OffersComponent } from './components/offers/offers.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CategoryDetailsComponent,
    ImageSliderComponent,
    FooterComponent,
    HomeComponent,
    LoginSignupComponent,
    AlertComponent,
    ProductDetailsComponent,
    ShoppingCartComponent,
    FavoritesComponent,
    SpinnerComponent,
    FooterComponent,
    FeaturesComponent,
    LoginSignupComponent,
    UserProfileComponent,
    FeatureProductsComponent,
    DashboardComponent,
    UserManagementComponent,
    ProductManagementComponent,
    ViewProductComponent,
    ProductsComponent,
    CheckoutComponent,
    FeedbackComponent,
    UserResponseComponent,
    OffersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: ['*'], // Allow sending the token to all domains
        disallowedRoutes: [], // No routes are disallowed
      },
    }),
  ],
  providers: [AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
