import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Timestamp} from "firebase/firestore";
import {Brand} from "../../../products/interfaces/brand";
import {BrandService} from "../../../products/services/brand.service";

@Component({
  selector: 'app-settings-products-brands',
  templateUrl: './settings-products-brands.component.html',
  styleUrls: ['./settings-products-brands.component.scss']
})
export class SettingsProductsBrandsComponent implements OnInit, OnDestroy {
@Input() firebaseUser = {} as User;
@Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  newBrandForm: FormGroup;
  private unsubscribe$ = new Subject<boolean>();
  listBrands: Brand[] = [];

  constructor(private brandService: BrandService, private fb: FormBuilder) {
    this.newBrandForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.brandService.getBrands()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listBrands = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  async deleteBrand(brand:Brand) {
    try {
      await this.brandService.deleteBrand(brand);
    } catch (e) {
      console.log(e);
    }
  }

  async onSubmit(firebaseUser: User) {
    let newBrand: Brand;
    if (this.newBrandForm.valid) {
      newBrand = this.newBrandForm.value;
      newBrand.name = newBrand.name.toUpperCase();
      newBrand.createdAt = Timestamp.fromDate(new Date());
      newBrand.updatedAt = Timestamp.fromDate(new Date());
      newBrand.createdBy = firebaseUser.uid;
      newBrand.updatedBy = firebaseUser.uid;

      try {
        await this.brandService.addBrand(newBrand);
        this.newBrandForm.reset();
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("error");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
