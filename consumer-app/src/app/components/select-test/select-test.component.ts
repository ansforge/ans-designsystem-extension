import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-test.component.html'
})
export class SelectTestComponent {
  selectValue = 'FR';
  options = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' }
  ];
}
