import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../data/types';
import { api } from '../data/db';
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('falcon_fc_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setIsLoading(false);
  }, []);
  const login = async (username: string, password: string) => {
    const loggedInUser = await api.login(username, password);
    setUser(loggedInUser);
    localStorage.setItem('falcon_fc_user', JSON.stringify(loggedInUser));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('falcon_fc_user');
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout
      }}>
      
      {children}
    </AuthContext.Provider>);

};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};