import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
