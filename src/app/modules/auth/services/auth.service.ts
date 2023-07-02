import {Injectable} from '@angular/core';
import {Auth, User, authState, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import {EMPTY, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public user$: Observable<User | null> = EMPTY;

  constructor(private auth: Auth) {
    if (auth) {
      this.user$ = authState(this.auth);
    }
  }

  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
