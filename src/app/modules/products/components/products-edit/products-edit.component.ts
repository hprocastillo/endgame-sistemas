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
import {NgxImageCompressService} from "ngx-image-compress";

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
  photo_file_compressed: string | any;
  photo_preview: string = '';
  imgResultAfterCompress: string = '';

  private unsubscribe$ = new Subject<boolean>();
  listCategories: Category[] = [];
  listBrands: Brand[] = [];

  constructor(
    private imageCompress: NgxImageCompressService,
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

  async take_photo($event: any) {
    this.photo_file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.photo_preview = reader.result as string;
      this.compressFile(this.photo_preview);
    }
    reader.readAsDataURL(this.photo_file);
  }

  compressFile(imagePreview: any) {
    let orientation: number = -1;
    this.imageCompress.compressFile(imagePreview, orientation, 40, 40).then(
      result => {
        this.imgResultAfterCompress = result;
        this.photo_file_compressed = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
      }
    );
  }

  dataURItoBlob(dataURI: any) {
    const byteString: string = window.atob(dataURI);
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i: number = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/*'});
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
      uploadBytes(storageRef, this.photo_file_compressed)
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
