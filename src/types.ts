export type Role = 'Administrador' | 'Veterinario' | 'Voluntario' | 'Adoptante';

export interface User {
  id: number;
  username: string;
  role: Role;
  full_name?: string;
  email?: string;
  profile_pic?: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  status: string;
  image_url: string;
  vet_notes: string;
}

export interface Adoption {
  id: number;
  pet_id: number;
  user_id: number;
  status: string;
  request_date: string;
  pet_name?: string;
  user_name?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

export interface MedicalRecord {
  id: number;
  pet_id: number;
  vet_id: number;
  date: string;
  description: string;
  treatment: string;
}

export interface AdoptionFollowUp {
  id: number;
  adoption_id: number;
  date: string;
  notes: string;
  status: string;
}
