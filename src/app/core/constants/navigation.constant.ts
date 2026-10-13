import { MenuItem } from 'primeng/api';

export const NAV_MENU_ITEMS: MenuItem[] = [
  {
    label: 'NEO Candidates',
    icon: 'pi pi-table',
    routerLink: '/overview'
  },
  {
    label: 'Mission Inquiries',
    icon: 'pi pi-envelope',
    routerLink: '/contact'
  }
];
