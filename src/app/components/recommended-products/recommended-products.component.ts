import { Component } from '@angular/core';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.component.html',
  styleUrls: ['./recommended-products.component.css']
})
export class RecommendedProductsComponent {
  recommendedProducts = [
    { image: '../../../../../assets/images/recommended1.png', name: 'Nina & Hager Shrimp 500g' },
    { image: '../../../../../assets/images/recommended2.png', name: 'Nina & Hager Smoked Pork Sausage Hot Dog 400g' },
    { image: '../../../../../assets/images/recommended3.png', name: 'Nina & Hager Pork Steak 1Kg' }
  ];
}
