import { Component, inject } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { restaurantOutline, cartOutline, receiptOutline } from 'ionicons/icons';
import { CartService } from './core/services/cart.service';

/** The navigation shell: three peers, one bar, a live cart badge. */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  templateUrl: 'tabs.html',
  styleUrl: 'tabs.scss'
})
export class TabsPage {
  readonly cart = inject(CartService);

  constructor() {
    addIcons({ restaurantOutline, cartOutline, receiptOutline });
  }
}
