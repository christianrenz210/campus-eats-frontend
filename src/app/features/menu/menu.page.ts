import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
  IonRefresher, IonRefresherContent, IonButtons, IonButton, IonIcon,
  RefresherCustomEvent, ToastController, ViewWillEnter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { FoodCardComponent } from '../../shared/components/food-card/food-card.component';
import { FoodCardSkeletonComponent } from '../../shared/components/food-card-skeleton/food-card-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { MenuItem, Category } from '../../core/models/menu-item.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
    IonRefresher, IonRefresherContent, IonButtons, IonButton, IonIcon,
    FoodCardComponent, FoodCardSkeletonComponent, EmptyStateComponent, ErrorStateComponent
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

  readonly filter = signal<Category | 'all'>('all');
  readonly search = signal('');
  readonly categories: (Category | 'all')[] =
    ['all', 'rice', 'noodles', 'snacks', 'drinks', 'desserts'];
  readonly skeletons = [1, 2, 3, 4, 5, 6];

  constructor() {
    addIcons({ logInOutline });
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

  protected async addToCart(item: MenuItem) {
    this.cart.add(item);
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch { /* no haptics on web */ }

    await this.toastCtrl.dismiss().catch(() => undefined);
    const toast = await this.toastCtrl.create({
      message: `${item.name} added to cart`,
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
