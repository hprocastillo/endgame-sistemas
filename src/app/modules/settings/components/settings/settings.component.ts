import {Component} from '@angular/core';
import {Product} from "../../../products/interfaces/product";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  /** VARIABLES **/
  template: string = 'LIST';

  constructor(public authService: AuthService) {
  }

  getTemplate(template: string) {
    this.template = template;
  }

}
