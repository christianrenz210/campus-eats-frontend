import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { IonButton, IonChip, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, star, timeOutline } from 'ionicons/icons';
import { MenuItem } from '../../../core/models/menu-item.model';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, IonButton, IonChip, IonIcon],
  template: `
    <article class="card" [class.sold-out]="!item().available">
      <div class="thumb">
        @if (!imageFailed()) {
          <img
            [src]="item().image"
            [alt]="item().name"
            loading="lazy"
            (error)="imageFailed.set(true)" />
        } @else {
          <span class="emoji" role="img" [attr.aria-label]="item().name">{{ item().emoji }}</span>
        }
      </div>

      <div class="body">
        <div class="top">
          <span class="category">{{ item().category }}</span>
          <!-- Status is a colour AND a word, never colour on its own. -->
          <ion-chip [color]="item().available ? 'success' : 'medium'" class="status">
            {{ item().available ? 'Available' : 'Sold out' }}
          </ion-chip>
        </div>

        <h2>{{ item().name }}</h2>
        <p class="desc">{{ item().description }}</p>

        <div class="meta">
          <span>
            <ion-icon name="star" class="star" aria-hidden="true" />
            <span class="sr-only">Rated</span> {{ item().rating | number: '1.1-1' }}
          </span>
          <span>
            <ion-icon name="time-outline" aria-hidden="true" />
            {{ item().prepMinutes }} min
          </span>
        </div>

        <div class="footer">
          <span class="price">{{ item().price | currency: 'PHP' : 'symbol-narrow' }}</span>
          <ion-button
            shape="round"
            [disabled]="!item().available"
            [attr.aria-label]="'Add ' + item().name + ' to cart'"
            (click)="added.emit(item())">
            <ion-icon slot="start" name="add" aria-hidden="true" />
            Add
          </ion-button>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; height: 100%; }

    .card {
      height: 100%;
      display: flex;
      gap: 14px;
      padding: 12px;
      background: var(--ce-card);
      border: 1px solid var(--ce-border);
      border-radius: 18px;
      box-shadow: var(--ce-shadow);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover { transform: translateY(-2px); box-shadow: var(--ce-shadow-hover); }

    .thumb {
      flex: 0 0 112px;
      height: 112px;
      align-self: center;
      border-radius: 14px;
      overflow: hidden;
      background: var(--ce-soft);
      display: grid;
      place-items: center;
    }
    .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .emoji { font-size: 44px; }
    .sold-out .thumb img { filter: grayscale(0.85); opacity: 0.7; }

    .body { flex: 1; min-width: 0; display: flex; flex-direction: column; }

    .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .category {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ion-color-primary);
    }
    .status {
      margin: 0;
      height: 24px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
    }

    h2 { margin: 4px 0; font-size: 17px; font-weight: 600; line-height: 1.3; }
    .desc {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
      color: var(--ce-muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      font-size: 13px;
      color: var(--ce-muted);
    }
    .meta > span { display: inline-flex; align-items: center; gap: 4px; }
    .star { color: var(--ce-star); }

    .footer {
      margin-top: auto;
      padding-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .price { font-size: 18px; font-weight: 600; }
    ion-button { margin: 0; min-height: 44px; text-transform: none; font-weight: 600; }
  `
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
