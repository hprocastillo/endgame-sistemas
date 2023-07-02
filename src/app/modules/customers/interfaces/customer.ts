import {Timestamp} from "firebase/firestore";

export interface Customer {
  id?: string;
  //personal data
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  birthDay: Timestamp;

  //photos
  photoURL1: string;
  photoURL2: string;
  photoURL3: string;

  //social media data
  facebookURL: string;
  instagramURL: string;

  //subscriber data
  userSystem: string;

  //log data
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
