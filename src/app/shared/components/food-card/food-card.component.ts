import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, remove, star, timeOutline } from 'ionicons/icons';
import { MenuItem } from '../../../core/models/menu-item.model';

const MAX_QUANTITY = 50;

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, IonCard, IonCardContent, IonIcon],
  templateUrl: './food-card.html',
  styleUrl: './food-card.scss'
})
export class FoodCardComponent {
  /**
   * input() and output() replace the @Input and @Output decorators.
   * input.required() means the compiler rejects <app-food-card /> with no item.
   */
  readonly item = input.required<MenuItem>();
  /** How many are in the order. 0 means this dish isn't included. */
  readonly quantity = input(0);
  /** A typed emitter, with no EventEmitter import: the new quantity. */
  readonly quantityChange = output<number>();

  protected readonly max = MAX_QUANTITY;
  protected readonly imageFailed = signal(false);

  constructor() {
    addIcons({ add, remove, star, timeOutline });
  }

  protected step(delta: number) {
    const next = Math.min(MAX_QUANTITY, Math.max(0, this.quantity() + delta));
    if (next !== this.quantity()) this.quantityChange.emit(next);
  }
}
