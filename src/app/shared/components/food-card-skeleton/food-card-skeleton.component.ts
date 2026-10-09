import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular';

/** Same shape as the food card, so nothing jumps when the real data arrives. */
@Component({
  selector: 'app-food-card-skeleton',
  standalone: true,
  imports: [IonSkeletonText],
  template: `
    <div class="card" aria-hidden="true">
      <!-- Photo -->
      <ion-skeleton-text [animated]="true" class="thumb" />
      <div class="body">
        <!-- Category, name, rating + time -->
        <ion-skeleton-text [animated]="true" style="width: 40%; height: 10px" />
        <ion-skeleton-text [animated]="true" style="width: 85%; height: 16px; margin: 4px 0 2px" />
        <ion-skeleton-text [animated]="true" style="width: 55%; height: 11px" />
        <!-- Price + quantity stepper -->
        <div class="buy">
          <ion-skeleton-text [animated]="true" class="price" />
          <ion-skeleton-text [animated]="true" class="stepper" />
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 100%; }
    .card {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px;
      background: var(--ce-card);
      border: 1px solid var(--ce-border);
      border-radius: 18px;
      box-shadow: var(--ce-shadow);
    }
    .thumb { width: 100%; height: auto; aspect-ratio: 4 / 3; margin: 0; --border-radius: 14px; }
    .body { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 10px 2px 0; }
    .buy { margin-top: auto; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .price { width: 56px; height: 18px; }
    .stepper { width: 90px; height: 34px; --border-radius: 999px; }
    ion-skeleton-text { --border-radius: 6px; margin: 0; }
  `
})
export class FoodCardSkeletonComponent {}
