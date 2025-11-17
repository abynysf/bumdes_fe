import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setCookie, getCookieJSON, deleteCookie } from "../utils/cookies";

// Cookie configuration
const AUTH_COOKIE_NAME = "auth_session";
const AUTH_COOKIE_DURATION = 5; // minutes

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

// Auth cookie structure
interface AuthCookie {
  user: User;
  expiresAt: number;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
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

  // Restore session from cookie on mount
  useEffect(() => {
    console.log("🔍 Checking for existing auth cookie...");
    const authCookie = getCookieJSON<AuthCookie>(AUTH_COOKIE_NAME);

    if (authCookie) {
      console.log("🍪 Found auth cookie:", authCookie);
      // Check if cookie is still valid
      if (authCookie.expiresAt && authCookie.expiresAt > Date.now()) {
        const remainingTime = Math.round((authCookie.expiresAt - Date.now()) / 1000 / 60);
        console.log(`✅ Cookie is valid! Restoring session. Expires in ${remainingTime} minutes`);
        setUser(authCookie.user);
      } else {
        console.log("❌ Cookie expired, cleaning up");
        // Cookie expired, clean it up
        deleteCookie(AUTH_COOKIE_NAME);
      }
    } else {
      console.log("ℹ️ No auth cookie found");
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe = false): Promise<boolean> => {
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

        // If "Remember Me" is checked, save to cookie
        if (rememberMe) {
          const expiresAt = Date.now() + AUTH_COOKIE_DURATION * 60 * 1000;
          const authCookie: AuthCookie = {
            user: mockUser,
            expiresAt,
          };
          setCookie(AUTH_COOKIE_NAME, authCookie, AUTH_COOKIE_DURATION);
          console.log("✅ Cookie saved with Remember Me - expires in 5 minutes");
        } else {
          // Clear any existing cookie if not using Remember Me
          deleteCookie(AUTH_COOKIE_NAME);
          console.log("⚠️ Login without Remember Me - no cookie saved");
        }

        return true;
      }

      return false;
    },
    []
  );

  const logout = useCallback(() => {
    console.log("👋 Logging out and deleting cookie");
    setUser(null);
    deleteCookie(AUTH_COOKIE_NAME);
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
