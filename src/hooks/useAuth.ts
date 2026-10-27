import { useAuth } from '../context/AuthContext';

export function useAuthState(): ReturnType<typeof useAuth> {
  return useAuth();
}
