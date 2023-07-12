import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Product} from "../../interfaces/product";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @Output() productSelected = new EventEmitter<Product>();
  @Output() outTemplate = new EventEmitter<string>();
  /** VARIABLES **/
  page: number = 1;
  pageSize: number = 5;
  searchText: string = '';
  photoToZoom: string = '';
  listProducts: Product[] = [];
  private unsubscribe$ = new Subject<boolean>();

  constructor(private modalService: NgbModal, private productsService: ProductService) {
  }

  ngOnInit(): void {
    this.productsService.getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listProducts = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  openModalDelete(modalDelete: any) {
    this.modalService.open(modalDelete, {centered: true, backdrop: "static"});
  }

  openModalPhoto(modalPhoto: any, photo: string) {
    this.modalService.open(modalPhoto, {centered: true, backdrop: "static"});
    this.photoToZoom = photo;
  }

  getSelectProduct(product: Product) {
    this.productSelected.emit(product);
  }

  async deleteProduct(product: Product) {
    try {
      await this.productsService.deleteProduct(product);
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
