import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Customer} from "../../interfaces/customer";
import {CustomerService} from "../../services/customer.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {
  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  listCustomers: Customer[] = [];
  private unsubscribe$ = new Subject<boolean>();
  page: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerService.getCustomers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listCustomers = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
 }
  getCustomerSelected(customer: Customer) {
    this.customerSelected.emit(customer);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
