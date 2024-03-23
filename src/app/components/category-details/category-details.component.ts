import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { categories } from 'src/app/model/categories';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent {
  constructor(private router: Router){}
  @Output() categorySelected: EventEmitter<string> = new EventEmitter<string>(); // Change the type to string for category only

  categories = categories;
  
  selectCategory(category: any) {
    this.router.navigate(['/allProducts'])
    // Emit the selected category object
    this.categorySelected.emit(category);
  }
}