// lib/types.ts
export interface User {
    id: number;
    username: string;
    email: string;
    preferences: UserPreferences;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserPreferences {
    id: number;
    user_id: number;
    theme: 'light' | 'dark';
    language: 'english' | 'spanish' | 'indonesia';
    notifications: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginFormData {
    username: string;
    password: string;
  }
  
  export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
  }