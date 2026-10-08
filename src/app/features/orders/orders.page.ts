import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonGrid, IonRow, IonCol,
  IonChip, IonIcon, IonSkeletonText, IonRefresher, IonRefresherContent,
  RefresherCustomEvent, ToastController, ViewWillEnter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircleOutline, logOutOutline } from 'ionicons/icons';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

/** How long the Undo button stays on screen after cancelling an order. */
const UNDO_WINDOW_MS = 5000;

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
export class OrdersPage implements ViewWillEnter {
  private orders = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);
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

  /**
   * ion-tabs keeps this page alive when you switch tabs, so ngOnInit only
   * ever fires once — a second visit would keep showing a stale list even
   * after placing a new order. ionViewWillEnter fires on every visit,
   * including the first, so it reloads each time the tab becomes active.
   */
  ionViewWillEnter() {
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
   * Undo beats "Are you sure?": hide the order at once and offer Undo for a
   * few seconds. The server delete is permanent, so it is only sent once the
   * undo window closes — after that the cancel can no longer be undone.
   */
  protected async cancel(order: Order): Promise<void> {
    this.orders.hide(order);

    // Closing any open toast also ends that toast's undo window.
    await this.toastCtrl.dismiss().catch(() => undefined);
    const toast = await this.toastCtrl.create({
      message: `Order ${order.reference} cancelled`,
      duration: UNDO_WINDOW_MS,
      color: 'dark',
      positionAnchor: 'ce-tab-bar',
      position: 'bottom',
      buttons: [{ text: 'Undo', role: 'undo' }]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    if (role === 'undo') {
      this.orders.restore(order);
      return;
    }

    try {
      await this.orders.confirmDelete(order);
    } catch {
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
