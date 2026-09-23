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
        <ion-skeleton-text [animated]="true" style="width: 30%" />
        <ion-skeleton-text [animated]="true" style="width: 75%; height: 18px" />
        <ion-skeleton-text [animated]="true" style="width: 95%" />
        <ion-skeleton-text [animated]="true" style="width: 60%" />
        <div class="footer">
          <ion-skeleton-text [animated]="true" style="width: 60px; height: 20px" />
          <ion-skeleton-text [animated]="true" style="width: 84px; height: 36px; border-radius: 18px" />
        </div>
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
    }
    .thumb { flex: 0 0 112px; width: 112px; height: 112px; margin: 0; border-radius: 14px; }
    .body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
    ion-skeleton-text { --border-radius: 6px; margin: 0; }
  `
})
export class FoodCardSkeletonComponent {}
