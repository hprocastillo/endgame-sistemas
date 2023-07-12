import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../interfaces/product";

@Component({
  selector: 'app-products-list-item',
  templateUrl: './products-list-item.component.html',
  styleUrls: ['./products-list-item.component.scss']
})
export class ProductsListItemComponent {
  @Input() product = {} as Product;
  @Output() productToDelete = new EventEmitter<Product>();
  @Output() productToEdit = new EventEmitter<Product>();

  sendToEdit(product: Product) {
    this.productToEdit.emit(product);
  }

  sendToDelete(product: Product) {
    this.productToDelete.emit(product);
  }
}
