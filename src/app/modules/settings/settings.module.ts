import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './components/settings/settings.component';
import {SettingsListComponent} from './components/settings-list/settings-list.component';
import {
  NgbAccordionBody,
  NgbAccordionButton, NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbPagination
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  SettingsProductsCategoriesComponent
} from './components/settings-products-categories/settings-products-categories.component';
import {
  SettingsProductsBrandsComponent
} from "./components/settings-products-brands/settings-products-brands.component";
import { BrandFilterPipe } from './pipes/brand-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter.pipe';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsListComponent,
    SettingsProductsCategoriesComponent,
    SettingsProductsBrandsComponent,
    BrandFilterPipe,
    CategoryFilterPipe,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgOptimizedImage,
    NgbPagination,
    ReactiveFormsModule,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    FormsModule
  ]
})
export class SettingsModule {
}
