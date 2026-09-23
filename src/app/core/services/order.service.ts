import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order, NewOrder } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private orders = signal<Order[]>([]);
  readonly all = this.orders.asReadonly();

  private busy = signal(false);
  readonly loading = this.busy.asReadonly();

  private failed = signal(false);
  readonly error = this.failed.asReadonly();

  /** Ids hidden optimistically while their undo window is open. */
  private hidden = signal<ReadonlySet<string>>(new Set());

  /** What the orders page shows: everything not waiting to be deleted. */
  readonly visible = computed(() =>
    this.orders().filter(o => !this.hidden().has(o.id))
  );

  load() {
    this.busy.set(true);
    this.failed.set(false);

    this.http.get<Order[]>(`${this.api}/orders`).subscribe({
      next: list => {
        this.orders.set(list);
        this.busy.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.busy.set(false);
      }
    });
  }

  place(order: NewOrder) {
    return this.http.post<Order>(`${this.api}/orders`, order);
  }

  hide(order: Order) {
    this.hidden.update(s => new Set(s).add(order.id));
  }

  restore(order: Order) {
    this.hidden.update(s => {
      const next = new Set(s);
      next.delete(order.id);
      return next;
    });
  }

  isHidden(order: Order) {
    return this.hidden().has(order.id);
  }

  /** Called only after the undo window closes without an undo. */
  async confirmDelete(order: Order): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.api}/orders/${order.id}`)
      );
    } finally {
      this.restore(order);
      this.load();
    }
  }
}
