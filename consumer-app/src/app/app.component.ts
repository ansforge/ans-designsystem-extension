import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseComponent } from './components/showcase/showcase.component';
import { ButtonTestComponent } from './components/button-test/button-test.component';
import { BadgeTestComponent } from './components/badge-test/badge-test.component';
import { RadioTestComponent } from './components/radio-test/radio-test.component';
import { CheckboxTestComponent } from './components/checkbox-test/checkbox-test.component';
import { InputTestComponent } from './components/input-test/input-test.component';
import { SelectTestComponent } from './components/select-test/select-test.component';
import { ButtonGroupTestComponent } from './components/button-group-test/button-group-test.component';
import { LinkTestComponent } from './components/link-test/link-test.component';
import { StepperTestComponent } from './components/stepper-test/stepper-test.component';
import { AlertTestComponent } from './components/alert-test/alert-test.component';
import { ModalTestComponent } from './components/modal-test/modal-test.component';
import { TileTestComponent } from './components/tile-test/tile-test.component';
import { HeaderFooterTestComponent } from './components/header-footer-test/header-footer-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ShowcaseComponent, 
    ButtonTestComponent, 
    BadgeTestComponent, 
    RadioTestComponent,
    CheckboxTestComponent,
    InputTestComponent,
    SelectTestComponent,
    ButtonGroupTestComponent,
    LinkTestComponent,
    StepperTestComponent,
    AlertTestComponent,
    ModalTestComponent,
    TileTestComponent,
    HeaderFooterTestComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  activeTab: 'showcase' | 'buttons' | 'badges' | 'radios' | 'checkbox' | 'input' | 'select' | 'button-group' | 'link' | 'stepper' | 'alerts' | 'tiles' | 'modal' | 'header-footer' = 'header-footer';
  
  title = 'Test Consumer App';

  openModal(modalId: string) {
    const modalNode = document.getElementById(modalId) as HTMLDialogElement;
    if (modalNode && typeof modalNode.showModal === 'function') {
      modalNode.showModal();
    } else if (modalNode) {
      modalNode.classList.add('fr-modal--opened');
    }
  }

  closeModal(modalId: string) {
    const modalNode = document.getElementById(modalId) as HTMLDialogElement;
    if (modalNode && typeof modalNode.close === 'function') {
      modalNode.close();
    } else if (modalNode) {
      modalNode.classList.remove('fr-modal--opened');
    }
  }
}
