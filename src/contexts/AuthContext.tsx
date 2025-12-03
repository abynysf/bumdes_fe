import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setCookie, getCookieJSON, deleteCookie } from "../utils/cookies";
import { authApi } from "../utils/api";

// Cookie configuration
const AUTH_COOKIE_NAME = "auth_session";
const AUTH_COOKIE_DURATION = 60; // minutes (increased from 5)

// User type - matches backend API response
export interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
  desaUid: string | null;
  kecamatanUid: string | null;
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
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    console.log("🔍 Checking for existing auth cookie...");
    const authCookie = getCookieJSON<AuthCookie>(AUTH_COOKIE_NAME);

    if (authCookie) {
      console.log("🍪 Found auth cookie:", authCookie);
      // Check if cookie is still valid
      if (authCookie.expiresAt && authCookie.expiresAt > Date.now()) {
        const remainingTime = Math.round(
          (authCookie.expiresAt - Date.now()) / 1000 / 60
        );
        console.log(
          `✅ Cookie is valid! Restoring session. Expires in ${remainingTime} minutes`
        );
        setUser(authCookie.user);
      } else {
        console.log("❌ Cookie expired, cleaning up");
        deleteCookie(AUTH_COOKIE_NAME);
      }
    } else {
      console.log("ℹ️ No auth cookie found");
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe = false
    ): Promise<boolean> => {
      // === LOCAL FALLBACK MODE (DEMO) ===
      // Mock login - accepts any credentials
      const mockUser: User = {
        id: 1,
        email: email,
        displayName: "Demo User",
        role: "admin",
        desaUid: "demo-desa",
        kecamatanUid: "demo-kecamatan",
      };

      setUser(mockUser);

      const expiresAt = Date.now() + AUTH_COOKIE_DURATION * 60 * 1000;
      const authCookie: AuthCookie = {
        user: mockUser,
        expiresAt,
      };

      if (rememberMe) {
        setCookie(AUTH_COOKIE_NAME, authCookie, AUTH_COOKIE_DURATION);
        console.log("✅ [DEMO] Cookie saved with Remember Me");
      } else {
        setCookie(AUTH_COOKIE_NAME, authCookie, 0);
        console.log("✅ [DEMO] Session cookie saved");
      }

      return true;
      // === END LOCAL FALLBACK MODE ===

      /* === ORIGINAL API CODE (commented for demo) ===
      try {
        const response = await authApi.login(email, password);

        if (response.ok && response.user) {
          const loggedInUser: User = {
            id: response.user.id,
            email: response.user.email,
            displayName: response.user.displayName,
            role: response.user.role,
            desaUid: response.user.desaUid,
            kecamatanUid: response.user.kecamatanUid,
          };

          setUser(loggedInUser);

          // Always save session - rememberMe controls duration
          const expiresAt = Date.now() + AUTH_COOKIE_DURATION * 60 * 1000;
          const authCookie: AuthCookie = {
            user: loggedInUser,
            expiresAt,
          };

          if (rememberMe) {
            // Persistent cookie with expiration
            setCookie(AUTH_COOKIE_NAME, authCookie, AUTH_COOKIE_DURATION);
            console.log(
              "✅ Cookie saved with Remember Me - expires in 60 minutes"
            );
          } else {
            // Session cookie - expires when browser closes
            setCookie(AUTH_COOKIE_NAME, authCookie, 0);
            console.log("✅ Session cookie saved - expires on browser close");
          }

          return true;
        }

        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
      === END ORIGINAL API CODE === */
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
    isLoading,
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
