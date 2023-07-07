import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProductsCategoriesComponent } from './settings-products-categories.component';

describe('SettingsProductsCategoriesComponent', () => {
  let component: SettingsProductsCategoriesComponent;
  let fixture: ComponentFixture<SettingsProductsCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsProductsCategoriesComponent]
    });
    fixture = TestBed.createComponent(SettingsProductsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
