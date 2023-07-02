import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Product} from "../../interfaces/product";
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
  listProducts: Product[] = [];
  private unsubscribe$ = new Subject<boolean>();
  page: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listProducts = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  getProductSelected(product: Product) {
    this.productSelected.emit(product);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

