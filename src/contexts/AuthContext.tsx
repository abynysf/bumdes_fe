import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// Mock user credentials
const MOCK_CREDENTIALS = {
  email: "admin@bumdes.go",
  password: "password123",
};

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check credentials
      if (
        email === MOCK_CREDENTIALS.email &&
        password === MOCK_CREDENTIALS.password
      ) {
        // Mock user data
        const mockUser: User = {
          id: "1",
          name: "Admin BUMDesa",
          email: email,
          role: "Administrator",
        };

        setUser(mockUser);
        return true;
      }

      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
