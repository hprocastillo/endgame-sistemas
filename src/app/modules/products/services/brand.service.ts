import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference, deleteDoc, doc, docData,
  DocumentData,
  Firestore,
  orderBy,
  query, updateDoc
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Brand} from "../interfaces/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  brandsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.brandsCollection = collection(this.firestore, 'products-brands');
  }

  getBrands() {
    const q = query(this.brandsCollection, orderBy('name', 'asc'));
    return collectionData(q, {idField: 'id'}) as Observable<Brand[]>;
  }

  getBrandById(brand: Brand) {
    const brandDocumentReference = doc(this.firestore, `products-brands/${brand.id}`);
    return docData(brandDocumentReference, {idField: 'id'});
  }

  addBrand(brand: Brand) {
    return addDoc(this.brandsCollection, brand);
  }

  updateBrand(brand: Brand) {
    const brandDocumentReference = doc(this.firestore, `products-brands/${brand.id}`);
    return updateDoc(brandDocumentReference, {...brand});
  }

  deleteBrand(brand: Brand) {
    const brandDocumentReference = doc(this.firestore, `products-brands/${brand.id}`);
    return deleteDoc(brandDocumentReference);
  }
}
