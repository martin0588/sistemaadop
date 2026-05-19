import { Role } from './types';

export const ROLE_TABS: Record<Role, string[]> = {
  Administrador: [
    'dashboard',
    'pets',
    'users',
    'adoptions',
    'notifications',
    'reports',
    'profile',
  ],

  Veterinario: [
    'pets',
    'users',
    'profile',
  ],

  Voluntario: [
    'pets',
    'users',
    'adoptions',
    'profile',
  ],

  Adoptante: [
    'pets',
    'my-adoptions',
    'profile',
  ],
};

export const hasAccess = (
  role: Role,
  tab: string
): boolean => {
  return ROLE_TABS[role]?.includes(tab);
};