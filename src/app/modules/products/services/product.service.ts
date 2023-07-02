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
import {Product} from "../interfaces/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.productsCollection = collection(this.firestore, 'products');
  }

  getProducts() {
    const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<Product[]>;
  }

  getProductById(product: Product) {
    const productDocumentReference = doc(this.firestore, `products/${product.id}`);
    return docData(productDocumentReference, {idField: 'id'});
  }

  addProduct(product: Product) {
    return addDoc(this.productsCollection, product);
  }

  updateProduct(product: Product) {
    const productDocumentReference = doc(this.firestore, `products/${product.id}`);
    return updateDoc(productDocumentReference, {...product});
  }

  deleteProduct(product: Product) {
    const productDocumentReference = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(productDocumentReference);
  }
}
