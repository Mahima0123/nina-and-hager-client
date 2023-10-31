import { Component } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {
  slides: { imageSrc: string, title: string, description: string }[] = [
    {
      imageSrc: '../../../../../assets/images/image-slider1.jpeg',
      title: 'Groceries at Your Fingertips.',
      description: 'We bring the supermarket to your screen with just a few clicks.'
    },
    {
      imageSrc: '../../../../../assets/images/image-slider2.jpeg',
      title: 'One-Stop Grocery Destination.',
      description: 'Explore a world of choices that fulfill your every grocery need.'
    },
    {
      imageSrc: '../../../../../assets/images/image-slider3.jpeg',
      title: 'Delivery at Your Convenience.',
      description: 'We deliver top-quality products at your doorsteps.'
    }
  ];

  currentSlideIndex = 0;
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.rotateSlides();
    }, 5000);
  }

  rotateSlides() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

}
