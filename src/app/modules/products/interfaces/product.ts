import {Timestamp} from "firebase/firestore";

export interface Product {
  id?: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  barcode: string;
  photoURL: string;

  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
