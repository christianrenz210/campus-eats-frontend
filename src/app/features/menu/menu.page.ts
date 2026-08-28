import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonItem, IonLabel, IonSelect, IonSelectOption, IonList
} from '@ionic/angular';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { FoodCardComponent } from '../../shared/components/food-card/food-card.component';
import { MenuItem, Category } from '../../core/models/menu-item.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonItem, IonLabel, IonSelect, IonSelectOption, IonList,
    FoodCardComponent
  ],
  templateUrl: 'menu.page.html'
})
export class MenuPage implements OnInit {
  private menu = inject(MenuService);
  cart = inject(CartService);

  readonly items = this.menu.all;
  readonly loading = this.menu.loading;
  readonly error = this.menu.error;

  filter: Category | 'all' = 'all';
  readonly categories: (Category | 'all')[] =
    ['all', 'rice', 'noodles', 'snacks', 'drinks', 'desserts'];

  ngOnInit() {
    this.menu.load();
  }

  get visible(): MenuItem[] {
    const all = this.items();
    return this.filter === 'all'
      ? all
      : all.filter(i => i.category === this.filter);
  }
}
