import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-test.component.html'
})
export class InputTestComponent {
  textValue = 'Saisie standard';
  passwordValue = '';
  numberValue = 42;
  areaValue = 'Texte multi-ligne...';
  withIconValue = 'Saisie avec icône';
}
