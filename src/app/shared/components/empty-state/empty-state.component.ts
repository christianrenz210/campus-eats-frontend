import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { fastFoodOutline, searchOutline, cartOutline, receiptOutline } from 'ionicons/icons';

/** Says why the screen is empty, and offers the first action. */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <section class="state" role="status">
      <div class="icon"><ion-icon [name]="icon()" aria-hidden="true" /></div>
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <ion-button shape="round" (click)="action.emit()">{{ actionLabel() }}</ion-button>
      }
    </section>
  `,
  styleUrl: '../state.scss'
})
export class EmptyStateComponent {
  readonly icon = input('fast-food-outline');
  readonly title = input.required<string>();
  readonly message = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();

  constructor() {
    addIcons({ fastFoodOutline, searchOutline, cartOutline, receiptOutline });
  }
}
