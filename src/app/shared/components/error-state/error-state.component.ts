import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline, refresh } from 'ionicons/icons';

/** Plain language plus a retry button. */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <section class="state error" role="alert">
      <div class="icon"><ion-icon name="cloud-offline-outline" aria-hidden="true" /></div>
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
      <ion-button shape="round" (click)="retry.emit()">
        <ion-icon slot="start" name="refresh" aria-hidden="true" />
        Try again
      </ion-button>
    </section>
  `,
  styleUrl: '../state.scss'
})
export class ErrorStateComponent {
  readonly title = input('We couldn’t reach the canteen');
  readonly message = input('Check your connection, then try again.');
  readonly retry = output<void>();

  constructor() {
    addIcons({ cloudOfflineOutline, refresh });
  }
}
