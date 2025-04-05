
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '@/lib/data';
import { toast } from 'sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  premium?: boolean;
  phone?: string;
  bio?: string;
};

type UserContextType = {
  user: User;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>(() => {
    // Try to get user from local storage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });

  useEffect(() => {
    // Save user to local storage when it changes
    localStorage.setItem('user', JSON.stringify(user));
    
    // Also save name and email separately for other components to use easily
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    
    setIsLoading(false);
  }, [user]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...userData };
      return updatedUser;
    });
    toast.success("Profile updated successfully!");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
