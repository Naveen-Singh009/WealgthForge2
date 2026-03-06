import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  submitting = false;
  otpRequired = false;
  otpEmail = '';
  authMessage = '';
  authMessageVariant: 'danger' | 'warning' = 'danger';

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  get otp() {
    return this.otpForm.controls.otp;
  }

  submit(): void {
    this.clearAuthMessage();

    if (this.otpRequired) {
      this.verifyOtp();
      return;
    }

    if (this.loginForm.invalid || this.submitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.loadingService.show();

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.clearAuthMessage();
        this.toastService.show('success', 'Login Successful', 'Welcome back to WealthForge Pro.');
        this.router.navigateByUrl(this.authService.getPostLoginRoute());
      },
      error: (error) => {
        const message = this.resolveLoginErrorMessage(error);

        if (error?.otpRequired || String(message).toLowerCase().includes('otp')) {
          this.otpRequired = true;
          this.otpEmail = error?.email ?? this.loginForm.controls.email.value;
          this.otpForm.reset({ otp: '' });
          this.showAuthMessage(String(message), 'warning');
          this.toastService.show('warning', 'OTP Verification Required', String(message));
        } else {
          this.showAuthMessage(String(message), 'danger');
          this.toastService.show('error', 'Login Failed', String(message));
        }

        this.loadingService.hide();
        this.submitting = false;
      },
      complete: () => {
        this.loadingService.hide();
        this.submitting = false;
      },
    });
  }

  verifyOtp(): void {
    this.clearAuthMessage();

    if (this.otpForm.invalid || this.submitting) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.loadingService.show();

    this.authService.verifyLoginOtp({
      email: this.otpEmail || this.loginForm.controls.email.value,
      otp: this.otpForm.controls.otp.value,
    }).subscribe({
      next: () => {
        this.clearAuthMessage();
        this.toastService.show('success', 'Login Successful', 'OTP verified successfully.');
        this.router.navigateByUrl(this.authService.getPostLoginRoute());
      },
      error: (error) => {
        const message = this.extractErrorMessage(error, 'Invalid OTP. Please try again.');
        this.showAuthMessage(String(message), 'danger');
        this.toastService.show('error', 'OTP Verification Failed', String(message));
      },
      complete: () => {
        this.loadingService.hide();
        this.submitting = false;
      },
    });
  }

  backToPasswordLogin(): void {
    this.otpRequired = false;
    this.otpEmail = '';
    this.otpForm.reset({ otp: '' });
    this.clearAuthMessage();
  }

  private resolveLoginErrorMessage(error: unknown): string {
    const fallback = 'Invalid email or password. Please try again.';
    const message = this.extractErrorMessage(error, fallback);
    const httpStatus = (error as { status?: number } | null)?.status;
    if (httpStatus === 401 && !message.toLowerCase().includes('otp')) {
      return fallback;
    }

    return message;
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    const typedError = error as {
      error?: { message?: unknown; error?: unknown } | string;
      message?: unknown;
    };

    const nestedMessage = (typedError?.error as { message?: unknown } | undefined)?.message;
    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage.trim();
    }

    const nestedError = (typedError?.error as { error?: unknown } | undefined)?.error;
    if (typeof nestedError === 'string' && nestedError.trim()) {
      return nestedError.trim();
    }

    if (typeof typedError?.error === 'string' && typedError.error.trim()) {
      return typedError.error.trim();
    }

    if (typeof typedError?.message === 'string' && typedError.message.trim()) {
      return typedError.message.trim();
    }

    return fallback;
  }

  private showAuthMessage(message: string, variant: 'danger' | 'warning'): void {
    this.authMessage = message;
    this.authMessageVariant = variant;
  }

  private clearAuthMessage(): void {
    this.authMessage = '';
    this.authMessageVariant = 'danger';
  }
}
