import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /** VARIABLES **/
  formLogin: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    try {
      await this.authService.login(this.formLogin.value)
        .then(res => {
          console.log(res);
          this.router.navigate(['/home']);
        });
    } catch (e) {
      console.log(e);
    }
  }

}
