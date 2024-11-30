// app/context/UserContext.tsx
"use client"
import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    dob?: string;
    gender: string;
    contactNumber: string;
    email: string;
    address: string;
    role: string;
    bio?: string;
    licenseNumber?: string;
    licenseExpiration?: string;
    yearsOfExperience?: number;
    education?: string;
    certifications: string[];
    specializations: string[];
    languages: string[];
    shiftPreferences: string[];
    skills: string[];
    profilePictureUrl?: string;
}

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({ user: null });

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/nurse/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};