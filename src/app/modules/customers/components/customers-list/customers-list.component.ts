import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Customer} from "../../interfaces/customer";
import {CustomerService} from "../../services/customer.service";
import {Subject, takeUntil} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  photoToZoom: string = '';

  constructor(private modalService: NgbModal, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerService.getCustomers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listCustomers = res;
      });
  }

  openModalDelete(modalDelete: any) {
    this.modalService.open(modalDelete, {centered: true, backdrop: "static"});
  }

  openModalPhoto(modalPhoto: any, photo: string) {
    this.modalService.open(modalPhoto, {centered: true, backdrop: "static"});
    this.photoToZoom = photo;
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  getCustomerSelected(customer: Customer) {
    this.customerSelected.emit(customer);
  }

  async deleteCustomer(customer: Customer) {
    try {
      await this.customerService.deleteCustomer(customer);
      this.modalService.dismissAll();
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
