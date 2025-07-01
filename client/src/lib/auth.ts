// Additional auth utilities can be added here if needed
export type { User } from "@shared/schema";

// Note: AuthProvider is in auth.tsx - import directly from there to avoid circular references

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'kinton_token',
  USER: 'kinton_user',
} as const;

export function getStoredAuth() {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { token, user };
    }
  } catch (error) {
    console.error('Error parsing stored auth data:', error);
    clearStoredAuth();
  }
  
  return null;
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
}

export function setStoredAuth(token: string, user: any) {
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
}

export function isManager(userType?: string): boolean {
  return userType === 'MANAGER' || userType === 'ADMIN';
}

export function isCustomer(userType?: string): boolean {
  return userType === 'CUSTOMER';
}
