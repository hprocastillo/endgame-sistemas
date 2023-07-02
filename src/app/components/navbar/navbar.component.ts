import {Component} from '@angular/core';
import {AuthService} from "../../modules/auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  collapsed: boolean = true;

  constructor(public authService: AuthService, private router: Router) {
  }

  async logout() {
    try {
      await this.authService.logout().then(res => {
        console.log(res);
        this.router.navigate(['/auth']);
      })
    } catch (e) {
      console.log(e);
    }
  }

}
