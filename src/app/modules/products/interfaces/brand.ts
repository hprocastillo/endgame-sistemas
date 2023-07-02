import {Timestamp} from "firebase/firestore";

export interface Brand {
  id?: string;
  name: string;

  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
