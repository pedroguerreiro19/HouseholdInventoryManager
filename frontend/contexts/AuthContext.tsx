import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/models';
import { getGroupById } from "../utils/api";

interface AuthContextProps {
  userToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user:any ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTokenAndUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        console.log("Token loaded from AsyncStorage:", token);
        console.log("User loaded from AsyncStorage:", storedUser);
        if (token) setUserToken(token);
        if (storedUser) setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error loading token", error);
        } finally {
          setIsLoading(false);
        }
    };

    loadTokenAndUser();
  }, []);

  const login = async (token: string, user: any) => {
    const normalizedUser = {...user, _id: user._id || user.id};

    if (typeof normalizedUser.familyGroup === "string") {
      try {
        const group = await getGroupById(normalizedUser.familyGroup, token);
        normalizedUser.familyGroup = group;
      } catch (err) {
        console.error("Erro ao buscar dados do grupo:", err);
      }
    }

    
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUserToken(token);
    setUser(normalizedUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);