import {Component, Input} from '@angular/core';
import {Customer} from "../../interfaces/customer";

@Component({
  selector: 'app-customers-list-item',
  templateUrl: './customers-list-item.component.html',
  styleUrls: ['./customers-list-item.component.scss']
})
export class CustomersListItemComponent {
  @Input() customer = {} as Customer;
}
