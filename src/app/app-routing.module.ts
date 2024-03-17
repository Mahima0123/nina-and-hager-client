import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/admin/dashboard/user-management/user-management.component';
import { ProductManagementComponent } from './pages/admin/dashboard/product-management/product-management.component';
import { ViewProductComponent } from './pages/admin/dashboard/view-product/view-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsComponent } from './pages/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginSignupComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'user', component: UserManagementComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'product', component: ProductManagementComponent },
  { path: 'view-product', component: ViewProductComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'allProducts', component: ProductsComponent },
  { path: 'checkout', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
