import { Injectable, signal, computed, inject } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { CartLine } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<CartLine[]>([]);
  readonly all = this.lines.asReadonly();

  readonly count = computed(() =>
    this.lines().reduce((n, l) => n + l.quantity, 0)
  );

  readonly total = computed(() =>
    this.lines().reduce((s, l) => s + l.item.price * l.quantity, 0)
  );

  add(item: MenuItem) {
    const found = this.lines().find(l => l.item.id === item.id);
    this.lines.update(ls => found
      ? ls.map(l => l.item.id === item.id
        ? { ...l, quantity: l.quantity + 1 } : l)
      : [...ls, { item, quantity: 1 }]
    );
  }

  remove(itemId: number) {
    this.lines.update(ls => ls.filter(l => l.item.id !== itemId));
  }

  clear() {
    this.lines.set([]);
  }
}
