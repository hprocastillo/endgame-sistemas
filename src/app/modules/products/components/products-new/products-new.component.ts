import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {ProductService} from "../../services/product.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "@angular/fire/auth";
import {Product} from "../../interfaces/product";
import {Timestamp} from "firebase/firestore";
import {Subject, takeUntil} from "rxjs";
import {Category} from "../../interfaces/category";
import {CategoryService} from "../../services/category.service";
import {BrandService} from "../../services/brand.service";
import {Brand} from "../../interfaces/brand";
import {NgxImageCompressService} from "ngx-image-compress";

@Component({
  selector: 'app-products-new',
  templateUrl: './products-new.component.html',
  styleUrls: ['./products-new.component.scss']
})

export class ProductsNewComponent implements OnInit, OnDestroy {
  @Input() firebaseUser = {} as User;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  newProductForm: FormGroup;
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
    private storage: Storage,
    private fb: FormBuilder) {

    this.newProductForm = this.fb.group({
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      barcode: [''],
      stock: [''],
    });
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
      this.compressFile(this.photo_preview);
    }
    reader.readAsDataURL(this.photo_file);
  }

  compressFile(imagePreview: any) {
    let orientation: number = -1;
    if (this.photo_file['size'] > 51200) {
      this.imageCompress.compressFile(imagePreview, orientation, 50, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          this.photo_file_compressed = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
        }
      );
    } else {
      this.photo_file_compressed = this.photo_file;
    }
  }

  dataURItoBlob(dataURI: any) {
    const byteString: string = window.atob(dataURI);
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i: number = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/jpeg'});
  }

  deletePreview() {
    this.photo_preview = '';
  }

  async onSubmit(firebaseUser: User) {
    this.loadingEffect = true;
    let newProduct: Product;

    if (this.newProductForm.valid) {
      newProduct = this.newProductForm.value;
      newProduct.createdAt = Timestamp.fromDate(new Date());
      newProduct.updatedAt = Timestamp.fromDate(new Date());
      newProduct.createdBy = firebaseUser.uid;
      newProduct.updatedBy = firebaseUser.uid;

      /** UPLOAD PHOTO **/
      if (this.photo_file) {
        const storageRef = ref(this.storage, `products/${this.photo_file.name}`);
        uploadBytes(storageRef, this.photo_file_compressed)
          .then(async () => {
            newProduct.photoURL = await getDownloadURL(storageRef);
            await this.productService.addProduct(newProduct);
            this.newProductForm.reset();
            this.outTemplate.emit('LIST');
          })
          .catch((e) => console.log(e));

      } else {
        newProduct.photoURL = './assets/images/modules/products/product.png';
        await this.productService.addProduct(newProduct);
        this.newProductForm.reset();
        this.outTemplate.emit('LIST');
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
