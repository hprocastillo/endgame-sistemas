import {Component, Input} from '@angular/core';
import {Product} from "../../interfaces/product";

@Component({
  selector: 'app-products-list-item',
  templateUrl: './products-list-item.component.html',
  styleUrls: ['./products-list-item.component.scss']
})
export class ProductsListItemComponent {
  @Input() product = {} as Product;
}
