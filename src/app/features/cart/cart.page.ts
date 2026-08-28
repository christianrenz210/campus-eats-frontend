import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonInput, IonText, IonNote
} from '@ionic/angular';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NewOrder } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonInput, IonNote
  ],
  templateUrl: 'cart.page.html'
})
export class CartPage {
  private cart = inject(CartService);
  private orders = inject(OrderService);
  private router = inject(Router);

  readonly lines = this.cart.all;
  readonly total = this.cart.total;

  customerName = '';
  roomOrStall = '';

  placeOrder() {
    const order: NewOrder = {
      customerName: this.customerName,
      roomOrStall: this.roomOrStall,
      lines: this.cart.all().map(l => ({
        itemId: l.item.id,
        quantity: l.quantity
      }))
    };

    this.orders.place(order).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigateByUrl('/orders');
      }
    });
  }

  remove(itemId: number) {
    this.cart.remove(itemId);
  }
}
