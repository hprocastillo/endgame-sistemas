import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {ProductService} from "../../services/product.service";
import {User} from "@angular/fire/auth";
import {Product} from "../../interfaces/product";
import {Timestamp} from "firebase/firestore";
import {BrandService} from "../../services/brand.service";
import {CategoryService} from "../../services/category.service";
import {Subject, takeUntil} from "rxjs";
import {Category} from "../../interfaces/category";
import {Brand} from "../../interfaces/brand";

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss']
})
export class ProductsEditComponent implements OnInit, OnDestroy {
  @Input() product = {} as Product;
  @Input() firebaseUser = {} as User;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  loadingEffect: boolean = false;
  photo_file: string | any;
  photo_preview: string = '';

  private unsubscribe$ = new Subject<boolean>();
  listCategories: Category[] = [];
  listBrands: Brand[] = [];

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private storage: Storage) {
  }

  ngOnInit() {
    // get categories list
    this.categoryService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listCategories = res;
      });
    // get brands list
    this.brandService.getBrands()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.listBrands = res;
      });
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  take_photo($event: any) {
    this.photo_file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.photo_preview = reader.result as string;
    }
    reader.readAsDataURL(this.photo_file);
  }

  deletePreview() {
    this.photo_preview = '';
  }

  async onSubmit(product: Product, firebaseUser: User) {
    this.loadingEffect = true;
    let editProduct: Product;
    editProduct = product;
    editProduct.updatedAt = Timestamp.fromDate(new Date());
    editProduct.updatedBy = firebaseUser.uid;

    /** UPLOAD PHOTO **/
    if (this.photo_file) {
      const storageRef = ref(this.storage, `products/${this.photo_file.name}`);
      uploadBytes(storageRef, this.photo_file)
        .then(async () => {
          editProduct.photoURL = await getDownloadURL(storageRef);
          await this.productService.updateProduct(editProduct);
          this.outTemplate.emit('VIEW');
        })
        .catch((e) => console.log(e));

    } else {
      await this.productService.updateProduct(editProduct);
      this.outTemplate.emit('VIEW');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
