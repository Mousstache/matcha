export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  age?: number;
  gender?: string | number;
  description?: string;
  latitude?: number;
  longitude?: number;
  fame_rate?: number;
  city?: string;
  interests?: string[] | string;
  lastconnection?: string;
  isonline?: boolean;
  online?: boolean;
  birthDate?: number;
  preference?: number;
  profile_picture?: string;
}
