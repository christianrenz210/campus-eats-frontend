import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' }) // one singleton
export class MenuService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private items = signal<MenuItem[]>([]);
  private busy = signal(false);
  private failed = signal(false);

  readonly all = this.items.asReadonly();
  readonly loading = this.busy.asReadonly();
  readonly error = this.failed.asReadonly();

  load() {
    this.busy.set(true);
    this.failed.set(false);

    this.http.get<MenuItem[]>(`${this.api}/menu`).subscribe({
      next: list => {
        this.items.set(list);
        this.busy.set(false);
      },

      error: () => {
        this.failed.set(true);
        this.busy.set(false);
      }
    });
  }
}