'use client';

import { AuthProvider as AuthContextProvider } from '../../hooks/useAuth';

export default function AuthProvider({ children }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}