import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, receiptOutline } from 'ionicons/icons';
import { MenuItem } from '../../core/models/menu-item.model';

/** A dish picked on the menu with its quantity — not in the cart yet. */
export interface SelectedLine {
  item: MenuItem;
  quantity: number;
}

/**
 * Beside the menu on wide screens: every dish picked with a quantity above 0
 * and what it comes to, before any of it is added to the cart.
 */
@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CurrencyPipe, IonButton, IonIcon],
  template: `
    <section class="summary" aria-labelledby="summary-title">
      <header>
        <h2 id="summary-title">Your order</h2>
        @if (count() > 0) {
          <button type="button" class="clear" (click)="clear.emit()">Clear</button>
        }
      </header>

      @if (count() === 0) {
        <div class="empty">
          <ion-icon name="receipt-outline" aria-hidden="true" />
          <p>Nothing picked yet. Tap <strong>+</strong> on a dish, then add it to your cart here.</p>
        </div>
      } @else {
        <ul class="lines">
          @for (line of lines(); track line.item.id) {
            <li>
              <span class="qty">{{ line.quantity }}×</span>
              <span class="name">{{ line.item.name }}</span>
              <span class="amount">{{ line.item.price * line.quantity | currency: 'PHP' : 'symbol-narrow' }}</span>
              <button
                type="button"
                class="remove"
                [attr.aria-label]="'Remove ' + line.item.name"
                (click)="remove.emit(line.item.id)">
                <ion-icon name="close-outline" aria-hidden="true" />
              </button>
            </li>
          }
        </ul>

        <dl class="totals">
          <div>
            <dt>Items</dt>
            <dd>{{ count() }}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd>{{ total() | currency: 'PHP' : 'symbol-narrow' }}</dd>
          </div>
          <div class="grand">
            <dt>Total</dt>
            <dd>{{ total() | currency: 'PHP' : 'symbol-narrow' }}</dd>
          </div>
        </dl>
      }

      <ion-button expand="block" [disabled]="count() === 0" (click)="addToCart.emit()">
        Add to cart
      </ion-button>
    </section>
  `,
  styles: `
    :host { display: block; }
    /* Inside the phone review sheet: the sheet is already the surface. */
    :host(.flat) .summary { padding: 8px 4px; border: 0; border-radius: 0; box-shadow: none; background: transparent; }
    .summary {
      padding: 20px;
      border-radius: 20px;
      background: var(--ce-card);
      border: 1px solid var(--ce-border);
      box-shadow: var(--ce-shadow);
    }
    header { display: flex; align-items: center; justify-content: space-between; }
    h2 { margin: 0; font-size: 19px; font-weight: 600; }
    .clear {
      border: 0; background: none; padding: 6px 4px;
      color: var(--ion-color-primary); font: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
    }

    .empty { padding: 28px 8px; text-align: center; color: var(--ce-muted); }
    .empty ion-icon { font-size: 36px; opacity: 0.6; }
    .empty p { margin: 8px 0 0; font-size: 14px; }

    .lines { list-style: none; margin: 14px 0 0; padding: 0; max-height: 42vh; overflow-y: auto; }
    .lines li {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: 8px;
      padding: 9px 0;
      border-bottom: 1px solid var(--ce-border);
      font-size: 14px;
    }
    .qty { color: var(--ce-muted); font-weight: 500; }
    .name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .amount { font-weight: 600; }
    .remove {
      display: grid; place-items: center; width: 28px; height: 28px; padding: 0;
      border: 0; border-radius: 50%; background: none; color: var(--ce-muted); font-size: 16px; cursor: pointer;
    }
    .remove:hover { background: var(--ce-soft); color: var(--ion-text-color); }

    .totals { margin: 14px 0 0; display: grid; gap: 6px; }
    .totals div { display: flex; justify-content: space-between; font-size: 14px; color: var(--ce-muted); }
    .totals dd { margin: 0; }
    .totals .grand { margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--ce-border); color: var(--ion-text-color); }
    .grand dt { font-weight: 600; font-size: 16px; }
    .grand dd { font-weight: 700; font-size: 20px; }

    ion-button { margin: 18px 0 0; min-height: 48px; text-transform: none; font-weight: 600; --border-radius: 14px; }
  `
})
export class OrderSummaryComponent {
  readonly lines = input.required<SelectedLine[]>();
  readonly count = input.required<number>();
  readonly total = input.required<number>();

  readonly remove = output<number>();
  readonly clear = output<void>();
  readonly addToCart = output<void>();

  constructor() {
    addIcons({ closeOutline, receiptOutline });
  }
}
