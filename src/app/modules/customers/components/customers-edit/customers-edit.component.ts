import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Customer} from "../../interfaces/customer";
import {User} from "@angular/fire/auth";
import {CustomerService} from "../../services/customer.service";
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {Timestamp} from "firebase/firestore";
import {NgxImageCompressService} from "ngx-image-compress";

@Component({
  selector: 'app-customers-edit',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.scss']
})

export class CustomersEditComponent implements OnInit {
  @Input() customer = {} as Customer;
  @Input() firebaseUser = {} as User;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  birthdayValueDefault: string = '';
  birthDay: any;
  loadingEffect: boolean = false;

  /** PHOTO FILES **/
  photo1_file: string | any;
  photo1_preview: string = '';
  photo1_file_compressed: string | any;
  photo1_resultAfterCompress: string = '';
  photo2_file: string | any;
  photo2_preview: string = '';
  photo2_file_compressed: string | any;
  photo2_resultAfterCompress: string = '';
  photo3_file: string | any;
  photo3_preview: string = '';
  photo3_file_compressed: string | any;
  photo3_resultAfterCompress: string = '';

  constructor(
    private imageCompress: NgxImageCompressService,
    private customerService: CustomerService,
    private storage: Storage) {
  }

  ngOnInit(): void {
    if (this.customer.birthDay) {
      this.birthdayValueDefault = this.customerService.setDateToInput(this.customer.birthDay);
    }
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }

  getBirthday($event: any) {
    this.birthDay = this.customerService.getDateFromInput($event);
  }

  take_photo1($event: any) {
    this.photo1_file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.photo1_preview = reader.result as string;
      this.compressFile1(this.photo1_preview);
    }
    reader.readAsDataURL(this.photo1_file);
  }

  compressFile1(imagePreview: any) {
    let orientation: number = -1;
    if (this.photo1_file['size'] > 51200) {
      this.imageCompress.compressFile(imagePreview, orientation, 50, 50).then(
        result => {
          this.photo1_resultAfterCompress = result;
          this.photo1_file_compressed = this.dataURItoBlob(this.photo1_resultAfterCompress.split(',')[1]);
        }
      );
    } else {
      this.photo1_file_compressed = this.photo1_file;
    }
  }

  take_photo2($event: any) {
    this.photo2_file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.photo2_preview = reader.result as string;
      this.compressFile2(this.photo2_preview);
    }
    reader.readAsDataURL(this.photo2_file);
  }

  compressFile2(imagePreview: any) {
    let orientation: number = -1;
    if (this.photo2_file['size'] > 51200) {
      this.imageCompress.compressFile(imagePreview, orientation, 50, 50).then(
        result => {
          this.photo2_resultAfterCompress = result;
          this.photo2_file_compressed = this.dataURItoBlob(this.photo2_resultAfterCompress.split(',')[1]);
        }
      );
    } else {
      this.photo2_file_compressed = this.photo2_file;
    }
  }

  take_photo3($event: any) {
    this.photo3_file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.photo3_preview = reader.result as string;
      this.compressFile3(this.photo3_preview);
    }
    reader.readAsDataURL(this.photo3_file);
  }

  compressFile3(imagePreview: any) {
    let orientation: number = -1;
    if (this.photo3_file['size'] > 51200) {
      this.imageCompress.compressFile(imagePreview, orientation, 50, 50).then(
        result => {
          this.photo3_resultAfterCompress = result;
          this.photo3_file_compressed = this.dataURItoBlob(this.photo3_resultAfterCompress.split(',')[1]);
        }
      );
    } else {
      this.photo3_file_compressed = this.photo3_file;
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

  deletePreview(photo: string) {
    if (photo === 'PHOTO 1') {
      this.photo1_preview = '';
    }
    if (photo === 'PHOTO 2') {
      this.photo2_preview = '';
    }
    if (photo === 'PHOTO 3') {
      this.photo3_preview = '';
    }
  }

  async onSubmit(customer: Customer, firebaseUser: User) {
    this.loadingEffect = true;
    let editCustomer: Customer;
    editCustomer = customer;
    editCustomer.updatedAt = Timestamp.fromDate(new Date());
    editCustomer.updatedBy = firebaseUser.uid;

    if (this.birthDay) {
      editCustomer.birthDay = Timestamp.fromDate(this.birthDay);
    }

    /********************* UPLOAD ALL PHOTOS **********************/
    if (this.photo1_file && this.photo2_file && this.photo3_file) {
      const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
      const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
      const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);

      /** UPLOAD PHOTO 1 **/
      uploadBytes(storageRef1, this.photo1_file_compressed)
        .then(async () => {
          editCustomer.photoURL1 = await getDownloadURL(storageRef1);
          /** UPLOAD PHOTO 2 **/
          uploadBytes(storageRef2, this.photo2_file_compressed)
            .then(async () => {
              editCustomer.photoURL2 = await getDownloadURL(storageRef2);
              /** UPLOAD PHOTO 3 **/
              uploadBytes(storageRef3, this.photo3_file_compressed)
                .then(async () => {
                  editCustomer.photoURL3 = await getDownloadURL(storageRef3);
                  await this.customerService.updateCustomer(editCustomer);
                  this.outTemplate.emit('VIEW');
                })
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));

      /********************* DO NOT UPLOAD ANYTHING ************************/
    } else if (!this.photo1_file && !this.photo2_file && !this.photo3_file) {
      await this.customerService.updateCustomer(editCustomer);
      this.outTemplate.emit('VIEW');

      /********************** UPLOAD JUST PHOTO 1 *************************/
    } else if (this.photo1_file && !this.photo2_file && !this.photo3_file) {
      const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
      uploadBytes(storageRef1, this.photo1_file_compressed)
        .then(async () => {
          editCustomer.photoURL1 = await getDownloadURL(storageRef1);
          await this.customerService.updateCustomer(editCustomer);
          this.outTemplate.emit('VIEW');
        })
        .catch((e) => console.log(e));

      /********************** UPLOAD JUST PHOTO 2 *************************/
    } else if (!this.photo1_file && this.photo2_file && !this.photo3_file) {
      const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
      uploadBytes(storageRef2, this.photo2_file_compressed)
        .then(async () => {
          editCustomer.photoURL2 = await getDownloadURL(storageRef2);
          await this.customerService.updateCustomer(editCustomer);
          this.outTemplate.emit('VIEW');
        })
        .catch((e) => console.log(e));

      /********************** UPLOAD JUST PHOTO 3 *************************/
    } else if (!this.photo1_file && !this.photo2_file && this.photo3_file) {
      const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);
      uploadBytes(storageRef3, this.photo3_file_compressed)
        .then(async () => {
          editCustomer.photoURL3 = await getDownloadURL(storageRef3);
          await this.customerService.updateCustomer(editCustomer);
          this.outTemplate.emit('VIEW');
        })
        .catch((e) => console.log(e));

      /******************** UPLOAD JUST PHOTO 1 AND 2 **********************/
    } else if (this.photo1_file && this.photo2_file && !this.photo3_file) {
      const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
      const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
      /** UPLOAD PHOTO 1 **/
      uploadBytes(storageRef1, this.photo1_file_compressed)
        .then(async () => {
          editCustomer.photoURL1 = await getDownloadURL(storageRef1);
          /** UPLOAD PHOTO 2 **/
          uploadBytes(storageRef2, this.photo2_file_compressed)
            .then(async () => {
              editCustomer.photoURL2 = await getDownloadURL(storageRef2);
              await this.customerService.updateCustomer(editCustomer);
              this.outTemplate.emit('VIEW');
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));


      /******************* UPLOAD JUST PHOTO 1 AND 3 **********************/
    } else if (this.photo1_file && !this.photo2_file && this.photo3_file) {
      const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
      const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);
      /** UPLOAD PHOTO 1 **/
      uploadBytes(storageRef1, this.photo1_file_compressed)
        .then(async () => {
          editCustomer.photoURL1 = await getDownloadURL(storageRef1);
          /** UPLOAD PHOTO 3 **/
          uploadBytes(storageRef3, this.photo3_file_compressed)
            .then(async () => {
              editCustomer.photoURL3 = await getDownloadURL(storageRef3);
              await this.customerService.updateCustomer(editCustomer);
              this.outTemplate.emit('VIEW');
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));

      /******************* UPLOAD JUST PHOTO 2 AND 3 **********************/
    } else if (!this.photo1_file && this.photo2_file && this.photo3_file) {
      const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
      const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);
      /** UPLOAD PHOTO 2 **/
      uploadBytes(storageRef2, this.photo2_file_compressed)
        .then(async () => {
          editCustomer.photoURL2 = await getDownloadURL(storageRef2);
          /** UPLOAD PHOTO 3 **/
          uploadBytes(storageRef3, this.photo3_file_compressed)
            .then(async () => {
              editCustomer.photoURL3 = await getDownloadURL(storageRef3);
              await this.customerService.updateCustomer(editCustomer);
              this.outTemplate.emit('VIEW');
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  }
}
