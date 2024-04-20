type User = {
  id?: string;
  user_name?: string;
  token?: string;
}

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export type { User, UserContextType };
