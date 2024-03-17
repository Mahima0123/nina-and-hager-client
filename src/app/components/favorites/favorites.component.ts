import { Component } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  favoriteItems: any[] = [];
  previousRoute: string = '/'; // Default to '/' if there's no previous route

  constructor(private favoriteService: FavoriteService, private router: Router) {}

  ngOnInit(): void {
    this.loadFavoriteItems();
    
    // Retrieve previous route from navigation history
    const navigationHistory = this.router.getCurrentNavigation()?.previousNavigation;
    if (navigationHistory) {
      this.previousRoute = this.extractUrlFromUrlTree(navigationHistory.initialUrl) || '/';
    }
  }

  loadFavoriteItems(): void {
    this.favoriteService.getFavoriteItemsWithImages().subscribe(
      (favoriteItems: any[]) => {
        this.favoriteItems = favoriteItems;
      },
      (error: any) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  toggleFavorite(item: any) {
    if (this.isFavorite(item)) {
      this.favoriteService.removeFromFavorite(item);
    } else {
      this.favoriteService.addToFavorite(item);
    }
    this.loadFavoriteItems(); // Reload favorite items after toggling
  }

  isFavorite(item: any): boolean {
    // Check if the item is in the favorites
    return this.favoriteItems.some(favorite => favorite.id === item.id);
  }

  private extractUrlFromUrlTree(urlTree: UrlTree): string {
    // Extract the string representation of the URL from the UrlTree object
    return this.router.serializeUrl(urlTree);
  }

  continueShopping(): void {
    // Navigate back to the previous route
    this.router.navigateByUrl(this.previousRoute);
  }
}