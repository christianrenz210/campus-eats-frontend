import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular';

/** Same shape as the food card, so nothing jumps when the real data arrives. */
@Component({
  selector: 'app-food-card-skeleton',
  standalone: true,
  imports: [IonSkeletonText],
  template: `
    <div class="card" aria-hidden="true">
      <ion-skeleton-text [animated]="true" class="thumb" />
      <div class="body">
        <!-- Category + status chip -->
        <div class="top">
          <ion-skeleton-text [animated]="true" style="width: 30%; height: 12px" />
          <ion-skeleton-text [animated]="true" class="chip" />
        </div>
        <!-- Name -->
        <ion-skeleton-text [animated]="true" style="width: 70%; height: 18px; margin: 6px 0" />
        <!-- Two-line description -->
        <ion-skeleton-text [animated]="true" style="width: 95%" />
        <ion-skeleton-text [animated]="true" style="width: 65%" />
        <!-- Rating, prep time, price -->
        <div class="meta">
          <ion-skeleton-text [animated]="true" style="width: 34px" />
          <ion-skeleton-text [animated]="true" style="width: 48px" />
          <ion-skeleton-text [animated]="true" class="price" />
        </div>
        <!-- Add to cart -->
        <ion-skeleton-text [animated]="true" class="button" />
      </div>
    </div>
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
    }
    .thumb { flex: 0 0 112px; width: 112px; height: 112px; margin: 0; align-self: center; --border-radius: 14px; }
    .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .chip { width: 72px; height: 24px; --border-radius: 999px; flex: none; }
    .meta { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
    .price { width: 56px; height: 20px; margin-left: auto; }
    .button { width: 100%; height: 44px; margin-top: auto; --border-radius: 10px; }
    ion-skeleton-text { --border-radius: 6px; margin: 0; }
  `
})
export class FoodCardSkeletonComponent {}
