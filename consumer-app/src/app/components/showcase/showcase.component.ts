import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './showcase.component.html'
})
export class ShowcaseComponent {
  @Input() title = '';
  @Output() modalTrigger = new EventEmitter<string>();

  nom = 'Jean Dupont';
  pays = 'FR';
  cguAccepted = false;
  tagVisible = true;

  optionsSelect = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' }
  ];

  onTagDismiss() {
    this.tagVisible = false;
  }

  triggerModal(id: string) {
    this.modalTrigger.emit(id);
  }
}
