import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox-test.component.html'
})
export class CheckboxTestComponent {
  check1 = false;
  check2 = true;
  checkGroup = {
    opt1: false,
    opt2: true,
    opt3: false
  };
}
