import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore, orderBy,
  query,
  updateDoc
} from "@angular/fire/firestore";
import {Customer} from "../interfaces/customer";
import {Observable} from "rxjs";
import {Timestamp} from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.customerCollection = collection(this.firestore, 'customers');
  }

  getCustomers() {
    const q = query(this.customerCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<Customer[]>;
  }

  getCustomerById(id: string) {
    const customerDocumentReference = doc(this.firestore, `customers/${id}`);
    return docData(customerDocumentReference, {idField: 'id'});
  }

  addCustomer(customer: Customer) {
    return addDoc(this.customerCollection, customer);
  }

  updateCustomer(customer: Customer) {
    const customerDocumentReference = doc(this.firestore, `customers/${customer.id}`);
    return updateDoc(customerDocumentReference, {...customer});
  }

  deleteCustomer(customer: Customer) {
    const customerDocumentReference = doc(this.firestore, `customers/${customer.id}`);
    return deleteDoc(customerDocumentReference);
  }

  /** GET BIRTHDAY METHODS **/

  getDateFromInput(data: any) {
    let date = new Date(data.value);
    let day: string;
    let month: string;
    let year: string;

    /** get Day **/
    if (date.getDate() < 9) {
      day = '0' + (date.getDate() + 1);
    } else {
      day = (date.getDate() + 1).toString();
    }

    /** get Month **/
    if (date.getMonth() < 9) {
      month = '0' + (date.getMonth() + 1);
    } else {
      month = (date.getMonth() + 1).toString();
    }

    /** get Year **/
    year = date.getFullYear().toString();
    return new Date(year + '-' + month + '-' + day + 'T00:00:00');
  }

  setDateToInput(data: Timestamp) {
    let day: string;
    let month: string;
    let year: string;

    /** get day **/
    if (data.toDate().getDate() < 9) {
      day = '0' + data.toDate().getDate().toString();
    } else {
      day = data.toDate().getDate().toString();
    }

    /** get month **/
    if (data.toDate().getMonth() < 9) {
      month = '0' + (data.toDate().getMonth() + 1).toString();
    } else {
      month = (data.toDate().getMonth() + 1).toString();
    }

    /** get year **/
    year = data.toDate().getFullYear().toString();

    return year + '-' + month + '-' + day;
  }


}
