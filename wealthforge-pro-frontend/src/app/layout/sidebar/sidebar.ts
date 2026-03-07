import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../shared/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  isProfileExpanded = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    const currentName = this.authService.getCurrentUser()?.name?.trim().toLowerCase();
    const shouldRefreshProfile = !currentName || currentName === 'user' || currentName === 'username';

    if (!shouldRefreshProfile) {
      return;
    }

    this.authService.refreshCurrentUserProfile().subscribe({
      next: () => {},
      error: () => {},
    });
  }

  get role(): UserRole | null {
    return this.authService.getRole();
  }

  get profileName(): string {
    const name = this.authService.getCurrentUser()?.name?.trim();
    if (!name || name.toLowerCase() === 'username') {
      return 'User';
    }
    return name;
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
