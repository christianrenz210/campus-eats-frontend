import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton,
  IonList, IonItem, IonLabel, IonInput, IonTextarea, IonNote, IonThumbnail,
  LoadingController, ToastController, ModalController
} from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { CartLine, NewOrder } from '../../core/models/order.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { EditCartLineModalComponent } from '../../shared/components/edit-cart-line-modal/edit-cart-line-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton,
    IonList, IonItem, IonLabel, IonInput, IonTextarea, IonNote, IonThumbnail,
    EmptyStateComponent
  ],
  templateUrl: 'cart.page.html',
  styleUrl: 'cart.page.scss'
})
export class CartPage {
  private cart = inject(CartService);
  private orders = inject(OrderService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  readonly lines = this.cart.all;
  readonly count = this.cart.count;
  readonly total = this.cart.total;

  customerName = inject(AuthService).user()?.name ?? '';
  roomOrStall = '';
  notes = '';

  goToMenu() {
    this.router.navigateByUrl('/tabs/menu');
  }

  /**
   * A focused sub-task that returns you where you were: the modal lets you
   * change the quantity or take the item out, then hands control back here.
   */
  protected async editLine(line: CartLine) {
    const modal = await this.modalCtrl.create({
      component: EditCartLineModalComponent,
      componentProps: { line }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss<{ quantity: number }>();
    if (role === 'confirm' && data) {
      this.cart.setQuantity(line.item.id, data.quantity);
    } else if (role === 'remove') {
      await this.remove(line);
    }
  }

  /** Undo beats "Are you sure?": remove at once, offer to put it back. */
  async remove(line: CartLine) {
    this.cart.remove(line.item.id);

    await this.toastCtrl.dismiss().catch(() => undefined);
    const toast = await this.toastCtrl.create({
      message: `${line.item.name} removed`,
      duration: 4000,
      color: 'dark',
      positionAnchor: 'ce-tab-bar',
      position: 'bottom',
      buttons: [
        {
          text: 'Undo',
          handler: () => {
            for (let i = 0; i < line.quantity; i++) this.cart.add(line.item);
          }
        }
      ]
    });
    await toast.present();
  }

  async placeOrder() {
    const draft: NewOrder = {
      customerName: this.customerName.trim(),
      roomOrStall: this.roomOrStall.trim(),
      notes: this.notes.trim(),
      lines: this.cart.all().map(l => ({
        itemId: l.item.id,
        quantity: l.quantity
      }))
    };

    const loader = await this.loadingCtrl.create({ message: 'Placing your order…' });
    await loader.present();

    try {
      const order = await firstValueFrom(this.orders.place(draft));
      this.cart.clear();
      this.notes = '';
      // A light buzz confirms the order without using a single pixel.
      try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch { /* no haptics on web */ }
      await this.toast(`Order ${order.reference} placed`, 'success');
      this.router.navigateByUrl('/tabs/orders');
    } catch (err) {
      const detail = err instanceof HttpErrorResponse && typeof err.error?.detail === 'string'
        ? err.error.detail
        : 'Could not reach the canteen. Please try again.';
      await this.toast(detail, 'danger');
    } finally {
      await loader.dismiss();
    }
  }

  private async toast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2500,
      positionAnchor: 'ce-tab-bar',
      position: 'bottom'
    });
    await toast.present();
  }
}
