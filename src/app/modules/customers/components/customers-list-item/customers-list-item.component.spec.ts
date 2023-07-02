import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersListItemComponent } from './customers-list-item.component';

describe('CustomersListItemComponent', () => {
  let component: CustomersListItemComponent;
  let fixture: ComponentFixture<CustomersListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersListItemComponent]
    });
    fixture = TestBed.createComponent(CustomersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
