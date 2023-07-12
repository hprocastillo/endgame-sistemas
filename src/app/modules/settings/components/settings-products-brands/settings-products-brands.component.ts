import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Timestamp} from "firebase/firestore";
import {Brand} from "../../../products/interfaces/brand";
import {BrandService} from "../../../products/services/brand.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  page: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  constructor(
    private modalService: NgbModal,
    private brandService: BrandService,
    private fb: FormBuilder) {

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

  openModalDelete(modalDelete: any) {
    this.modalService.open(modalDelete, {centered: true, backdrop: "static"});
  }

  openModalEdit(modalEdit: any) {
    this.modalService.open(modalEdit, {centered: true, backdrop: "static"});
  }

  openModalNew(modalNew: any) {
    this.modalService.open(modalNew, {centered: true, backdrop: "static"});
  }

  async updateBrand(brand: Brand) {
    try {
      brand.name = brand.name.toUpperCase();
      await this.brandService.updateBrand(brand);
      this.modalService.dismissAll();

    } catch (e) {
      console.log(e);
    }
  }

  async deleteBrand(brand: Brand) {
    try {
      await this.brandService.deleteBrand(brand);
      this.modalService.dismissAll();

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
        this.modalService.dismissAll();

      } catch (e) {
        console.log(e);
      }

    } else {
      this.modalService.dismissAll();
      console.log("error");

    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
