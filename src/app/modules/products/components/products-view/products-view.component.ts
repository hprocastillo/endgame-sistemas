import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../interfaces/product";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss']
})

export class ProductsViewComponent {
  @Input() product = {} as Product;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  imageToZoom: string = '';

  constructor(private modalService: NgbModal, private productService: ProductService) {
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  openModalDelete(modalDelete: any) {
    this.modalService.open(modalDelete, {centered: true, backdrop: "static"});
  }

  openModalPhoto(modalPhoto: any, photo: string) {
    this.modalService.open(modalPhoto, {centered: true, backdrop: "static"});
    this.imageToZoom = photo;
  }

  async deleteProduct(product: Product) {
    try {
      await this.productService.deleteProduct(product)
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
