import { useState, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import logo from "../assets/logo.svg";
import graphicSide from "../assets/Graphic Side.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
        showToast("error", "Please fill in all fields");
        return;
      }

      setIsLoading(true);

      try {
        const success = await login(email, password, rememberMe);

        if (success) {
          showToast("success", "Login successful!");
          navigate("/dashboard/profile");
        } else {
          showToast("error", "Invalid email or password");
        }
      } catch (error) {
        showToast("error", "An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, rememberMe, login, navigate, showToast]
  );

  const handleForgotPassword = useCallback(() => {
    showToast("info", "Forgot password feature coming soon");
  }, [showToast]);

  const handleGoogleSignIn = useCallback(() => {
    showToast("info", "Google sign-in feature coming soon");
  }, [showToast]);

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <img src={logo} alt="BUM Desa GO" className="h-10 w-10" />
            <span className="text-2xl font-bold text-neutral-800">
              BUM DESA GO
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              Sign In
            </h1>
            <p className="text-neutral-600">Sign in to stay connected.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />

            {/* Password Input */}
            <div className="relative">
              <TextInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700 disabled:opacity-50 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-neutral-700">Remember me?</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
              >
                Forgot Password
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
              loading={isLoading}
            >
              Sign in
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-neutral-500">
                  or sign in with other accounts?
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </form>

          {/* Dev Hint */}
          <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-800">
              <strong>Development Mode:</strong> Use{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5">
                admin@bumdes.go
              </code>{" "}
              /{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5">
                password123
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Graphic */}
      <div
        className="hidden lg:block lg:w-1/2"
        style={{
          backgroundImage: `url(${graphicSide})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
