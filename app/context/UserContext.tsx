// app/context/UserContext.tsx
"use client"
import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    bio: string;
    experience: number;
    certifications: string[];
    skills: string[];
  }
  

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({ user: null });

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user info once when the provider mounts
    const fetchUser = async () => {
      const response = await fetch('/api/nurse/me');
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};