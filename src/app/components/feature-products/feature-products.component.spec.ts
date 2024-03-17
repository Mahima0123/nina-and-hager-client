import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureProductsComponent } from './feature-products.component';

describe('FeatureProductsComponent', () => {
  let component: FeatureProductsComponent;
  let fixture: ComponentFixture<FeatureProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureProductsComponent]
    });
    fixture = TestBed.createComponent(FeatureProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
