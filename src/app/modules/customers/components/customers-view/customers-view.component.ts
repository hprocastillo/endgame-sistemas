import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Customer} from "../../interfaces/customer";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../services/customer.service";

@Component({
  selector: 'app-customers-view',
  templateUrl: './customers-view.component.html',
  styleUrls: ['./customers-view.component.scss']
})
export class CustomersViewComponent {
  @Input() customer = {} as Customer;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  imageFullSize: string = '';

  constructor(private modalService: NgbModal, private customerService: CustomerService) {
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  openModalDelete(modalDelete: any) {
    this.modalService.open(modalDelete, {centered: true, backdrop: "static"});
  }

  openModalPhoto(modalPhoto: any, photo: string) {
    this.modalService.open(modalPhoto, {centered: true, backdrop: "static"});
    this.imageFullSize = photo;
  }

  async deleteCustomer(customer: Customer) {
    try {
      await this.customerService.deleteCustomer(customer)
        .then(res => {
          console.log(res);
          this.outTemplate.emit('LIST');
          this.modalService.dismissAll();
        });
    } catch (e) {
      console.log(e);
    }
  }

}
