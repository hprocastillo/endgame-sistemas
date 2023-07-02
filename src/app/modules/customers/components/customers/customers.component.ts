import {Component} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Customer} from "../../interfaces/customer";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
  /** VARIABLES **/
  template: string = 'LIST';
  customerSelected = {} as Customer;
  constructor(public authService: AuthService) {
  }
  getTemplate(template: string) {
    this.template = template;
  }
  getCustomerSelected(customer: Customer) {
    this.template = 'VIEW';
    this.customerSelected = customer;
  }
}
