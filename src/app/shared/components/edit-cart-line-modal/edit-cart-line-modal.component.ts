import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon,
  ModalController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, remove, trashOutline, closeOutline } from 'ionicons/icons';
import { CartLine } from '../../../core/models/order.model';

const MAX_QUANTITY = 50;

/**
 * A focused sub-task that returns you where you were: change how many of
 * a dish are in the cart, or take it out entirely, without leaving the cart.
 */
@Component({
  selector: 'app-edit-cart-line-modal',
  standalone: true,
  imports: [
    CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon
  ],
  templateUrl: 'edit-cart-line-modal.component.html',
  styleUrl: 'edit-cart-line-modal.component.scss'
})
export class EditCartLineModalComponent implements OnInit {
  /**
   * Set by ModalController's componentProps, not a template binding — so a
   * plain field here, not a signal input(). Assigning through componentProps
   * would just overwrite a signal's accessor function with the raw value.
   */
  line!: CartLine;
  private modalCtrl = inject(ModalController);

  protected quantity = 1;
  protected readonly max = MAX_QUANTITY;

  constructor() {
    addIcons({ add, remove, trashOutline, closeOutline });
  }

  ngOnInit() {
    this.quantity = this.line.quantity;
  }

  protected step(delta: number) {
    this.quantity = Math.min(MAX_QUANTITY, Math.max(1, this.quantity + delta));
  }

  protected close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  protected save() {
    this.modalCtrl.dismiss({ quantity: this.quantity }, 'confirm');
  }

  protected removeItem() {
    this.modalCtrl.dismiss(null, 'remove');
  }
}
