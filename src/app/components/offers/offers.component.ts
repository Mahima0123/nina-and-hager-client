import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offers: any[] = [];

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.offerService.getOffers().subscribe((offers: any[]) => {
      this.offers = offers;
    });
  }
}
