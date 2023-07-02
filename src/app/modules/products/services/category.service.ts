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
import {Category} from "../interfaces/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.categoriesCollection = collection(this.firestore, 'products-categories');
  }

  getCategories() {
    const q = query(this.categoriesCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<Category[]>;
  }

  getCategoryById(category: Category) {
    const categoryDocumentReference = doc(this.firestore, `products-categories/${category.id}`);
    return docData(categoryDocumentReference, {idField: 'id'});
  }

  addCategory(category: Category) {
    return addDoc(this.categoriesCollection, category);
  }

  updateCategory(category: Category) {
    const categoryDocumentReference = doc(this.firestore, `products-categories/${category.id}`);
    return updateDoc(categoryDocumentReference, {...category});
  }

  deleteCategory(category: Category) {
    const categoryDocumentReference = doc(this.firestore, `products-categories/${category.id}`);
    return deleteDoc(categoryDocumentReference);
  }
}
