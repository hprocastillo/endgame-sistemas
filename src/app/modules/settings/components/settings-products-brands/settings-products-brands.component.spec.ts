import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProductsBrandsComponent } from './settings-products-brands.component';

describe('SettingsProductsBrandsComponent', () => {
  let component: SettingsProductsBrandsComponent;
  let fixture: ComponentFixture<SettingsProductsBrandsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsProductsBrandsComponent]
    });
    fixture = TestBed.createComponent(SettingsProductsBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
