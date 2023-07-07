import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ProductsRoutingModule} from './products-routing.module';
import {ProductsComponent} from './components/products/products.component';
import {ProductsListComponent} from './components/products-list/products-list.component';
import {ProductsListItemComponent} from './components/products-list-item/products-list-item.component';
import {ProductsNewComponent} from './components/products-new/products-new.component';
import {ProductsEditComponent} from './components/products-edit/products-edit.component';
import {ProductsViewComponent} from "./components/products-view/products-view.component";
import {ProductFilterPipe} from './pipes/product-filter.pipe';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    ProductsNewComponent,
    ProductsEditComponent,
    ProductsViewComponent,
    ProductFilterPipe
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    NgOptimizedImage,
    NgbPagination,
    ReactiveFormsModule
  ]
})
export class ProductsModule {
}
