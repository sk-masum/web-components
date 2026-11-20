import { Component, signal } from '@angular/core';
import { SkSidebarMenu, SkBottomDock } from '@seakh/ui-angular';

@Component({
  imports: [SkSidebarMenu, SkBottomDock],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-demo');
  isOpen = signal(false);
  selected = signal('');
  activeTab = signal('dashboard');

  items = [
    { id: 'materials', label: 'Materials', description: 'Materials & default prices' },
    { id: 'builders', label: 'Builders', description: 'Builders & delivery charges' },
    { id: 'contractors', label: 'Contractors', description: 'Contractors & square-foot rates' },
  ];

  onSelect(event: CustomEvent<{ id: string; label: string }>) {
    this.selected.set(event.detail.label);
    this.isOpen.set(false);
  }

  dockItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'materials', label: 'Materials', href: '/materials' },
    { id: 'transactions', label: 'Transactions', href: '/transactions', badge: 3 },
    { id: 'works', label: 'Projects', href: '/works' },
  ];

  onTabSelect(event: CustomEvent<{ id: string; label: string }>) {
    this.activeTab.set(event.detail.id);
  }
}
