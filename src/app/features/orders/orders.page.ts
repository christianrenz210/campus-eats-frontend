import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonNote, IonText
} from '@ionic/angular';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonNote
  ],
  templateUrl: 'orders.page.html'
})
export class OrdersPage implements OnInit {
  private orders = inject(OrderService);

  readonly list = this.orders.all;
  readonly loading = this.orders.loading;
  readonly error = this.orders.error;

  ngOnInit() {
    this.orders.load();
  }

  get newest() {
    return [...this.list()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }
}
