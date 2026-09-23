import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonInput, IonInputPasswordToggle, IonButton, IonText, IonSpinner
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonInput, IonInputPasswordToggle, IonButton, IonText, IonSpinner
  ],
  templateUrl: 'login.page.html',
  styleUrl: 'login.page.scss'
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = 'student@campus.edu';
  password = '';

  readonly busy = signal(false);
  readonly error = signal('');

  async signIn() {
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.email.trim(), this.password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/tabs/orders';
      this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    } catch (err) {
      this.error.set(
        err instanceof HttpErrorResponse && err.status === 401
          ? 'That email and password don’t match. Check them and try again.'
          : 'Could not reach the canteen. Check your connection and try again.'
      );
    } finally {
      this.busy.set(false);
    }
  }
}
