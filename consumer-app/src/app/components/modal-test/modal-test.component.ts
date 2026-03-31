import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-test.component.html'
})
export class ModalTestComponent {
  openModal(id: string) {
    const modalElement = document.getElementById(id) as HTMLDialogElement;
    if (modalElement && typeof modalElement.showModal === 'function') {
      modalElement.showModal();
    } else if (modalElement) {
      modalElement.classList.add('fr-modal--opened');
    }
  }

  closeModal(id: string) {
    const modalElement = document.getElementById(id) as HTMLDialogElement;
    if (modalElement && typeof modalElement.close === 'function') {
      modalElement.close();
    } else if (modalElement) {
      modalElement.classList.remove('fr-modal--opened');
    }
  }
}
