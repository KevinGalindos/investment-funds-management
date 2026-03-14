import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { CopCurrencyPipe } from '../shared/pipes/cop-currency.pipe';
import { ToastComponent } from '../shared/components/toast/toast.component';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive, CopCurrencyPipe, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  protected readonly userService = inject(UserService);

  protected readonly sidebarOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Fondos Disponibles', route: '/funds', icon: '📊' },
    { label: 'Mis Fondos', route: '/my-funds', icon: '💼' },
    { label: 'Historial', route: '/transactions', icon: '📋' },
  ];

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebarOnMobile(): void {
    this.sidebarOpen.set(false);
  }
}
