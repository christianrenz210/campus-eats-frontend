import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
  IonRefresher, IonRefresherContent, IonButtons, IonButton, IonIcon, IonFooter, IonModal,
  RefresherCustomEvent, ToastController, ViewWillEnter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronUp, logInOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { FoodCardComponent } from '../../shared/components/food-card/food-card.component';
import { FoodCardSkeletonComponent } from '../../shared/components/food-card-skeleton/food-card-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { MenuItem, Category } from '../../core/models/menu-item.model';
import { OrderSummaryComponent, SelectedLine } from './order-summary.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
    IonRefresher, IonRefresherContent, IonButtons, IonButton, IonIcon, IonFooter, IonModal,
    FoodCardComponent, FoodCardSkeletonComponent, EmptyStateComponent, ErrorStateComponent,
    OrderSummaryComponent
  ],
  templateUrl: 'menu.page.html',
  styleUrl: 'menu.page.scss'
})
export class MenuPage implements ViewWillEnter {
  protected readonly menu = inject(MenuService);
  private cart = inject(CartService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  protected readonly auth = inject(AuthService);

  readonly items = this.menu.all;
  readonly loading = this.menu.loading;
  readonly error = this.menu.error;
  /**
   * What you've picked on the menu but not yet added to the cart, by item id.
   * A dish that isn't here shows 0 on its card.
   */
  private readonly selection = signal<ReadonlyMap<number, SelectedLine>>(new Map());
  readonly selected = computed(() => [...this.selection().values()]);
  readonly selectedCount = computed(() => this.selected().reduce((n, l) => n + l.quantity, 0));
  readonly selectedTotal = computed(() =>
    this.selected().reduce((sum, l) => sum + l.item.price * l.quantity, 0)
  );
  /** Phones: the review sheet opened from the bar, before adding to the cart. */
  readonly reviewOpen = signal(false);

  readonly filter = signal<Category | 'all'>('all');
  readonly search = signal('');
  readonly categories: (Category | 'all')[] =
    ['all', 'rice', 'noodles', 'snacks', 'drinks', 'desserts'];
  readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {
    addIcons({ chevronUp, logInOutline });
  }

  readonly visible = computed<MenuItem[]>(() => {
    const cat = this.filter();
    const needle = this.search().trim().toLowerCase();
    return this.items().filter(i =>
      (cat === 'all' || i.category === cat) &&
      (!needle || i.name.toLowerCase().includes(needle) ||
        i.description.toLowerCase().includes(needle) ||
        i.category.toLowerCase().includes(needle))
    );
  });

  /**
   * ion-tabs keeps this page alive across tab switches, so ngOnInit only
   * fires once. ionViewWillEnter fires on every visit — including the
   * first — so availability stays fresh if you leave and come back.
   */
  ionViewWillEnter() {
    this.menu.load();
  }

  reload() {
    this.menu.load();
  }

  /** Pull-to-refresh: re-run the request, then tell Ionic we are done. */
  protected async refresh(event: RefresherCustomEvent): Promise<void> {
    this.menu.load();
    await event.target.complete();
  }

  /** Come back to the menu after signing in, not the login default. */
  protected signIn() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/tabs/menu' } });
  }

  protected clearFilters() {
    this.search.set('');
    this.filter.set('all');
  }

  protected quantityOf(item: MenuItem) {
    return this.selection().get(item.id)?.quantity ?? 0;
  }

  /** The card's − / +: only changes the selection. 0 leaves the dish out. */
  protected async setQuantity(item: MenuItem, quantity: number) {
    this.selection.update(current => {
      const next = new Map(current);
      if (quantity > 0) next.set(item.id, { item, quantity });
      else next.delete(item.id);
      return next;
    });
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch { /* no haptics on web */ }
  }

  protected removeSelected(itemId: number) {
    this.selection.update(current => {
      const next = new Map(current);
      next.delete(itemId);
      return next;
    });
    if (this.selectedCount() === 0) this.reviewOpen.set(false);
  }

  protected clearSelection() {
    this.selection.set(new Map());
    this.reviewOpen.set(false);
  }

  /** Nothing reaches the cart until this: add every picked dish, then reset the cards to 0. */
  protected async addSelectedToCart() {
    const count = this.selectedCount();
    if (count === 0) return;

    for (const { item, quantity } of this.selected()) this.cart.add(item, quantity);
    this.clearSelection();
    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch { /* no haptics on web */ }

    await this.toastCtrl.dismiss().catch(() => undefined);
    const toast = await this.toastCtrl.create({
      message: `${count} ${count === 1 ? 'item' : 'items'} added to cart`,
      duration: 2500,
      color: 'dark',
      positionAnchor: 'ce-tab-bar',
      position: 'bottom',
      // Success: confirm, then point at what is next.
      buttons: [
        { text: 'View cart', handler: () => { this.router.navigateByUrl('/tabs/cart'); } }
      ]
    });
    await toast.present();
  }
}
