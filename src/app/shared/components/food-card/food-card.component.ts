import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonText } from '@ionic/angular';
import { MenuItem } from '../../../core/models/menu-item.model';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe, IonCard, IonCardContent, IonButton, IonText],
  template: `
    <ion-card>
      <ion-card-content>
        <ion-text>
          <h2>{{ item.emoji }} {{ item.name }}</h2>
        </ion-text>
        <p>{{ item.description }}</p>
        <p>Category: {{ item.category }}</p>
        <p>Price: {{ item.price | currency }}</p>
        <p>Prep: {{ item.prepMinutes }} min</p>
        <p>Rating: {{ item.rating }}</p>
        <p>Available: {{ item.available ? 'Yes' : 'No' }}</p>

        <ion-button
          [disabled]="!item.available"
          (click)="added.emit(item)">
          Add to cart
        </ion-button>
      </ion-card-content>
    </ion-card>
  `
})
export class FoodCardComponent {
  @Input({ required: true }) item!: MenuItem;
  @Output() added = new EventEmitter<MenuItem>();
}
