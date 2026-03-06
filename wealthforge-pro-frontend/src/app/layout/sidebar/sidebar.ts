import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../shared/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  isProfileExpanded = false;

  constructor(private readonly authService: AuthService) {}

  get role(): UserRole | null {
    return this.authService.getRole();
  }

  get profileName(): string {
    return this.authService.getCurrentUser()?.name ?? 'User';
  }

  get profileEmail(): string {
    return this.authService.getCurrentUser()?.email ?? 'No email';
  }

  get roleLabel(): string {
    return this.authService.getCurrentRole() ?? 'Guest';
  }

  logout(): void {
    this.authService.logout();
  }

  toggleProfile(): void {
    this.isProfileExpanded = !this.isProfileExpanded;
  }
}
