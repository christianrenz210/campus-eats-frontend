import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonGrid, IonRow, IonCol,
  IonChip, IonIcon, IonSkeletonText, IonRefresher, IonRefresherContent,
  RefresherCustomEvent, AlertController, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircleOutline, logOutOutline } from 'ionicons/icons';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonGrid, IonRow, IonCol,
    IonChip, IonIcon, IonSkeletonText, IonRefresher, IonRefresherContent,
    EmptyStateComponent, ErrorStateComponent
  ],
  templateUrl: 'orders.page.html',
  styleUrl: 'orders.page.scss'
})
export class OrdersPage implements OnInit {
  private orders = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  readonly list = this.orders.visible;
  readonly loading = this.orders.loading;
  readonly error = this.orders.error;
  readonly user = this.auth.user;
  readonly skeletons = [1, 2, 3];

  readonly statusColor: Record<OrderStatus, string> = {
    pending: 'primary',
    preparing: 'tertiary',
    ready: 'success',
    delivered: 'medium',
    cancelled: 'danger'
  };

  constructor() {
    addIcons({ closeCircleOutline, logOutOutline });
  }

  ngOnInit() {
    this.orders.load();
  }

  reload() {
    this.orders.load();
  }

  protected async refresh(event: RefresherCustomEvent): Promise<void> {
    this.orders.load();
    await event.target.complete();
  }

  protected canCancel(order: Order) {
    return order.status === 'pending';
  }

  protected goToMenu() {
    this.router.navigateByUrl('/tabs/menu');
  }

  protected signOut() {
    this.auth.logout();
    this.router.navigateByUrl('/tabs/menu');
  }

  protected itemsSummary(order: Order) {
    return order.lines.map(l => `${l.quantity}× ${l.name}`).join(', ');
  }

  /**
   * ion-alert: blocks and forces an explicit yes or no. Cancelling an order
   * is destructive and cannot be undone server-side, so — unlike removing a
   * cart line — this is worth interrupting the person to confirm.
   */
  protected async cancel(order: Order): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cancel this order?',
      message: `Order ${order.reference} will be cancelled. This can’t be undone.`,
      buttons: [
        { text: 'Keep order', role: 'cancel' },
        {
          text: 'Cancel order',
          role: 'destructive',
          handler: () => this.confirmCancel(order)
        }
      ]
    });
    await alert.present();
  }

  private async confirmCancel(order: Order): Promise<void> {
    this.orders.hide(order);
    try {
      await this.orders.confirmDelete(order);
      await this.toast(`Order ${order.reference} cancelled`, 'dark');
    } catch {
      this.orders.restore(order);
      await this.toast(`Could not cancel ${order.reference}. Please try again.`, 'danger');
    }
  }

  private async toast(message: string, color: string) {
    await this.toastCtrl.dismiss().catch(() => undefined);
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      positionAnchor: 'ce-tab-bar',
      position: 'bottom'
    });
    await toast.present();
  }
}
