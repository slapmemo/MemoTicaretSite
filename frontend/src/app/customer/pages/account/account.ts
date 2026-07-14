import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;

  readonly profileForm = this.fb.group({
    name: [this.auth.user()?.name ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly profileMessage = signal<string | null>(null);
  readonly profileError = signal<string | null>(null);
  readonly savingProfile = signal(false);

  readonly passwordMessage = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);
  readonly savingPassword = signal(false);

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.profileMessage.set(null);
    this.profileError.set(null);
    this.savingProfile.set(true);

    const { name, email } = this.profileForm.getRawValue();
    this.auth.updateProfile(name!, email!).subscribe({
      next: () => {
        this.profileMessage.set('Profil güncellendi');
        this.savingProfile.set(false);
      },
      error: (err) => {
        this.profileError.set(err.error?.error || 'Profil güncellenemedi');
        this.savingProfile.set(false);
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;
    this.passwordMessage.set(null);
    this.passwordError.set(null);
    this.savingPassword.set(true);

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.passwordMessage.set('Şifre güncellendi');
        this.passwordForm.reset();
        this.savingPassword.set(false);
      },
      error: (err) => {
        this.passwordError.set(err.error?.error || 'Şifre güncellenemedi');
        this.savingPassword.set(false);
      },
    });
  }
}
