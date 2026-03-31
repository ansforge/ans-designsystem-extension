import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radio-test.component.html'
})
export class RadioTestComponent {
  radioValue = 'option1';
  radioError = '';
  radioSuccess = 'option1';
  radioDisabled = 'option1';
  radioRich = 'option1';
}
