"use client";

import { auth, githubProvider, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      setUser(currentUser);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    setUser(auth.currentUser);
  };

  const signInWithGithub = async () => {
    await signInWithPopup(auth, githubProvider);
    setUser(auth.currentUser);
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithGithub,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
