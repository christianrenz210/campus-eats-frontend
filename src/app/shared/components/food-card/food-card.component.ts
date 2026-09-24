import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, star, timeOutline } from 'ionicons/icons';
import { MenuItem } from '../../../core/models/menu-item.model';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, IonButton, IonCard, IonCardContent, IonChip, IonIcon],
  templateUrl: './food-card.html',
  styleUrl: './food-card.scss'
})
export class FoodCardComponent {
  /**
   * input() and output() replace the @Input and @Output decorators.
   * input.required() means the compiler rejects <app-food-card /> with no item.
   */
  readonly item = input.required<MenuItem>();
  /** A typed emitter, with no EventEmitter import. */
  readonly added = output<MenuItem>();

  protected readonly imageFailed = signal(false);

  constructor() {
    addIcons({ add, star, timeOutline });
  }
}
