// lib/api.ts
import { LoginFormData, RegisterFormData, User, UserPreferences } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portal2.incoe.astra.co.id/api/codingfirst/api';

// Helper function untuk mengambil token dari localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function untuk membuat headers dengan token
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (data: LoginFormData): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  },

  register: async (data: RegisterFormData): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    return response.json();
  },

  // User
  getUser: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/user`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to get user');
    }

    return response.json();
  },

  // Preferences
  getPreferences: async (): Promise<{ preferences: UserPreferences }> => {
    const response = await fetch(`${API_URL}/preferences`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to get preferences');
    }

    return response.json();
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<{ preferences: UserPreferences }> => {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update preferences');
    }

    return response.json();
  },

  // Claude
  sendMessageToClaude: async (message: string): Promise<{ message: string; preferences?: UserPreferences; action?: string }> => {
    const response = await fetch(`${API_URL}/claude`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to communicate with Claude');
    }

    return response.json();
  }
};