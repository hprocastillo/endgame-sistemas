import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent {
  @Output() outTemplate = new EventEmitter<string>();

  constructor() {
  }

  getTemplate(template: string) {
    this.outTemplate.emit(template);
  }
}
