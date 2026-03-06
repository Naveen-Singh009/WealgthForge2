import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login-otp',
  standalone: false,
  templateUrl: './login-otp.html',
  styleUrl: './login-otp.scss',
})
export class LoginOtpComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  submitting = false;
  otpEmail = '';
  authMessage = '';
  authMessageVariant: 'danger' | 'warning' = 'danger';

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  get otp() {
    return this.otpForm.controls.otp;
  }

  ngOnInit(): void {
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email')?.trim();
    const pendingEmail = this.authService.getPendingOtpEmail()?.trim();

    this.otpEmail = emailFromQuery || pendingEmail || '';
    if (this.otpEmail) {
      this.authService.setPendingOtpEmail(this.otpEmail);
      return;
    }

    this.toastService.show('warning', 'OTP Required', 'Enter login credentials first to receive OTP.');
    this.router.navigate(['/auth/login']);
  }

  submit(): void {
    this.clearAuthMessage();

    if (this.otpForm.invalid || this.submitting) {
      this.otpForm.markAllAsTouched();
      return;
    }

    if (!this.otpEmail) {
      this.showAuthMessage('Enter login credentials first to receive OTP.', 'warning');
      return;
    }

    this.submitting = true;
    this.loadingService.show();

    this.authService.verifyLoginOtp({
      email: this.otpEmail,
      otp: this.otpForm.controls.otp.value,
    }).subscribe({
      next: () => {
        this.authService.clearPendingOtpEmail();
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

  backToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: this.otpEmail ? { email: this.otpEmail } : undefined,
    });
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
