import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'staff';
}

interface LoginResponse {
  token: string;
  user: User;
}

const STORAGE_KEY = 'campuseats.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private session = signal<LoginResponse | null>(this.restore());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isSignedIn = computed(() => this.session() !== null);

  async login(email: string, password: string): Promise<User> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.api}/auth/login`, { email, password })
    );
    this.session.set(res);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res)); } catch { /* storage unavailable */ }
    return res.user;
  }

  logout() {
    this.session.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }

  private restore(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
