import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {Customer} from "../../interfaces/customer";
import {Timestamp} from "firebase/firestore";
import {CustomerService} from "../../services/customer.service";
import {NgxImageCompressService} from "ngx-image-compress";

@Component({
  selector: 'app-customers-new',
  templateUrl: './customers-new.component.html',
  styleUrls: ['./customers-new.component.scss']
})
export class CustomersNewComponent {
  @Input() firebaseUser = {} as User;
  @Output() outTemplate = new EventEmitter<string>();

  /** VARIABLES **/
  newCustomerForm: FormGroup;
  birthDay: any;
  loadingEffect: boolean = false;
  messageResult: string = '';

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
    private storage: Storage,
    private fb: FormBuilder) {

    this.newCustomerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      userSystem: [''],
      facebookURL: [''],
      instagramURL: [''],
    });
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
    this.imageCompress.compressFile(imagePreview, orientation, 40, 40).then(
      result => {
        this.photo1_resultAfterCompress = result;
        this.photo1_file_compressed = this.dataURItoBlob(this.photo1_resultAfterCompress.split(',')[1]);
      }
    );
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
    this.imageCompress.compressFile(imagePreview, orientation, 40, 40).then(
      result => {
        this.photo2_resultAfterCompress = result;
        this.photo2_file_compressed = this.dataURItoBlob(this.photo2_resultAfterCompress.split(',')[1]);
      }
    );
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
    this.imageCompress.compressFile(imagePreview, orientation, 40, 40).then(
      result => {
        this.photo3_resultAfterCompress = result;
        this.photo3_file_compressed = this.dataURItoBlob(this.photo3_resultAfterCompress.split(',')[1]);
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

  async onSubmit(firebaseUser: User) {
    this.loadingEffect = true;
    let newCustomer: Customer;

    if (this.newCustomerForm.valid && (this.birthDay || this.birthDay !== '')) {
      newCustomer = this.newCustomerForm.value;
      newCustomer.photoURL1 = './assets/images/modules/customers/customer.png';
      newCustomer.photoURL2 = './assets/images/modules/customers/customer.png';
      newCustomer.photoURL3 = './assets/images/modules/customers/customer.png';
      newCustomer.birthDay = Timestamp.fromDate(this.birthDay);
      newCustomer.createdAt = Timestamp.fromDate(new Date());
      newCustomer.createdBy = firebaseUser.uid;
      newCustomer.updatedAt = Timestamp.fromDate(new Date());
      newCustomer.updatedBy = firebaseUser.uid;

      /** UPLOAD ALL PHOTOS **/
      if (this.photo1_file && this.photo2_file && this.photo3_file) {
        const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
        const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
        const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);

        /** UPLOAD PHOTO 1 **/
        uploadBytes(storageRef1, this.photo1_file_compressed)
          .then(async () => {
            newCustomer.photoURL1 = await getDownloadURL(storageRef1);

            /** UPLOAD PHOTO 2 **/
            uploadBytes(storageRef2, this.photo2_file_compressed)
              .then(async () => {
                newCustomer.photoURL2 = await getDownloadURL(storageRef2);

                /** UPLOAD PHOTO 3 **/
                uploadBytes(storageRef3, this.photo3_file_compressed)
                  .then(async () => {
                    newCustomer.photoURL3 = await getDownloadURL(storageRef3);
                    await this.customerService.addCustomer(newCustomer);
                    this.newCustomerForm.reset();
                    this.outTemplate.emit('LIST');

                  })
                  .catch((e) => console.log(e));
              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));

        /** DO NOT UPLOAD ANYTHING **/
      } else if (!this.photo1_file && !this.photo2_file && !this.photo3_file) {
        await this.customerService.addCustomer(newCustomer);
        this.newCustomerForm.reset();
        this.outTemplate.emit('LIST');

        /** UPLOAD JUST PHOTO 1 **/
      } else if (this.photo1_file && !this.photo2_file && !this.photo3_file) {
        const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);

        uploadBytes(storageRef1, this.photo1_file_compressed)
          .then(async () => {
            newCustomer.photoURL1 = await getDownloadURL(storageRef1);
            await this.customerService.addCustomer(newCustomer);
            this.newCustomerForm.reset();
            this.outTemplate.emit('LIST');

          })
          .catch((e) => console.log(e));

        /** UPLOAD JUST PHOTO 2 **/
      } else if (!this.photo1_file && this.photo2_file && !this.photo3_file) {
        const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);

        uploadBytes(storageRef2, this.photo2_file_compressed)
          .then(async () => {
            newCustomer.photoURL2 = await getDownloadURL(storageRef2);
            await this.customerService.addCustomer(newCustomer);
            this.newCustomerForm.reset();
            this.outTemplate.emit('LIST');

          })
          .catch((e) => console.log(e));

        /** UPLOAD JUST PHOTO 3 **/
      } else if (!this.photo1_file && !this.photo2_file && this.photo3_file) {
        const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);

        uploadBytes(storageRef3, this.photo3_file_compressed)
          .then(async () => {
            newCustomer.photoURL3 = await getDownloadURL(storageRef3);
            await this.customerService.addCustomer(newCustomer);
            this.newCustomerForm.reset();
            this.outTemplate.emit('LIST');

          })
          .catch((e) => console.log(e));

        /** UPLOAD JUST PHOTO 1 AND 2 **/
      } else if (this.photo1_file && this.photo2_file && !this.photo3_file) {
        const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
        const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);

        /** UPLOAD PHOTO 1 **/
        uploadBytes(storageRef1, this.photo1_file_compressed)
          .then(async () => {
            newCustomer.photoURL1 = await getDownloadURL(storageRef1);

            /** UPLOAD PHOTO 2 **/
            uploadBytes(storageRef2, this.photo2_file_compressed)
              .then(async () => {
                newCustomer.photoURL2 = await getDownloadURL(storageRef2);
                await this.customerService.addCustomer(newCustomer);
                this.newCustomerForm.reset();
                this.outTemplate.emit('LIST');

              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));

        /** UPLOAD JUST PHOTO 1 AND 3 **/
      } else if (this.photo1_file && !this.photo2_file && this.photo3_file) {
        const storageRef1 = ref(this.storage, `customers/${this.photo1_file.name}`);
        const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);

        /** UPLOAD PHOTO 1 **/
        uploadBytes(storageRef1, this.photo1_file_compressed)
          .then(async () => {
            newCustomer.photoURL1 = await getDownloadURL(storageRef1);

            /** UPLOAD PHOTO 3 **/
            uploadBytes(storageRef3, this.photo3_file_compressed)
              .then(async () => {
                newCustomer.photoURL3 = await getDownloadURL(storageRef3);
                await this.customerService.addCustomer(newCustomer);
                this.newCustomerForm.reset();
                this.outTemplate.emit('LIST');

              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));

        /** UPLOAD JUST PHOTO 2 AND 3 **/
      } else if (!this.photo1_file && this.photo2_file && this.photo3_file) {
        const storageRef2 = ref(this.storage, `customers/${this.photo2_file.name}`);
        const storageRef3 = ref(this.storage, `customers/${this.photo3_file.name}`);

        /** UPLOAD PHOTO 2 **/
        uploadBytes(storageRef2, this.photo2_file_compressed)
          .then(async () => {
            newCustomer.photoURL2 = await getDownloadURL(storageRef2);

            /** UPLOAD PHOTO 3 **/
            uploadBytes(storageRef3, this.photo3_file_compressed)
              .then(async () => {
                newCustomer.photoURL3 = await getDownloadURL(storageRef3);
                await this.customerService.addCustomer(newCustomer);
                this.newCustomerForm.reset();
                this.outTemplate.emit('LIST');

              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      }
    } else {
      this.messageResult = 'Revisa todos los campos'
    }
  }
}
