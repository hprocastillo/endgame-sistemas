import {Component} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Product} from "../../interfaces/product";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  /** VARIABLES **/
  template: string = 'LIST';
  productSelected = {} as Product;

  constructor(public authService: AuthService) {
  }

  getTemplate(template: string) {
    this.template = template;
  }

  getProductSelected(product: Product) {
    this.template = 'VIEW';
    this.productSelected = product;
  }
}
