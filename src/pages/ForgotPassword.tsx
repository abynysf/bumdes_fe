import { useState, useCallback, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import logo from "../assets/logo.svg";
import graphicSide from "../assets/Graphic Side.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!email) {
        showToast("error", "Masukkan alamat email Anda");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("error", "Format email tidak valid");
        return;
      }

      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real app, this would call the forgot password API
        setIsSubmitted(true);
        showToast("success", "Link reset password telah dikirim ke email Anda");
      } catch {
        showToast("error", "Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, showToast]
  );

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <img src={logo} alt="BUM Desa GO" className="h-10 w-10" />
            <span className="text-2xl font-bold text-neutral-800">
              BUM DESA GO
            </span>
          </div>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke halaman login
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              Lupa Password?
            </h1>
            <p className="text-neutral-600">
              Masukkan alamat email yang terdaftar dan kami akan mengirimkan
              link untuk mereset password Anda.
            </p>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="space-y-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      Email Terkirim!
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      Kami telah mengirim link reset password ke{" "}
                      <strong>{email}</strong>. Silakan cek inbox atau folder
                      spam Anda.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-neutral-600">
                Tidak menerima email?{" "}
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Kirim ulang
                </button>
              </p>

              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Kembali ke Login
              </Button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
                loading={isLoading}
              >
                Kirim Link Reset
              </Button>

              {/* Back to Login */}
              <p className="text-center text-sm text-neutral-600">
                Sudah ingat password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Kembali ke Login
                </Link>
              </p>
            </form>
          )}
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
