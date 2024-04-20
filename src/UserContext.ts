import React from 'react';
import { UserContextType } from './types/User';

export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});