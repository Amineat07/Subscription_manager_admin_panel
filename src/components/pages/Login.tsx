import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../utils/Toast";


function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );

      const { access_token, role } = response.data;

      if (role !== "admin") {
        await toast.error("Access denied", "This panel is for admins only.");
        return;
      }

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);

      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        await toast.error(
          "Sign in failed",
          error.response?.data?.message ?? "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center px-4 py-8 font-['Inter',_'DM_Sans',_system-ui,_sans-serif]">
      <div className="bg-white border border-[#D8D8D8] rounded-[14px] p-8 w-full max-w-[400px]">

        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-11 h-11 bg-[#42B883] rounded-[11px] flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="2" fill="white" />
              <rect x="12" y="2" width="8" height="8" rx="2" fill="white" />
              <rect x="2" y="12" width="8" height="8" rx="2" fill="white" />
              <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.45" />
            </svg>
          </div>
          <h1 className="text-[20px] font-medium text-[#1A1A1A] leading-tight">
            Subtrack
          </h1>
          <p className="text-[13px] text-[#999999] mt-1">
            Admin panel · Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-[14px]">

          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="email"
              className="text-[11px] font-medium text-[#555555] uppercase tracking-[0.06em]"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full bg-[#F4F4F4] border border-[#D8D8D8] rounded-[8px] px-3 py-[9px] text-[13px] text-[#1A1A1A] placeholder-[#999999] outline-none transition-colors duration-150 focus:border-[#42B883] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-medium text-[#555555] uppercase tracking-[0.06em]"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F4F4F4] border border-[#D8D8D8] rounded-[8px] px-3 py-[9px] pr-10 text-[13px] text-[#1A1A1A] placeholder-[#999999] outline-none transition-colors duration-150 focus:border-[#42B883] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#555555] transition-colors duration-150"
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a9.77 9.77 0 012.168-3.582M6.343 6.343A9.956 9.956 0 0112 5c5 0 9 4 9 7a9.956 9.956 0 01-1.343 2.657M15 12a3 3 0 11-6 0 3 3 0 016 0M3 3l18 18" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-[#E8F4FD] border border-[#B5D4F4] rounded-[8px] px-3 py-[9px]">
            <svg className="flex-shrink-0 mt-[1px]" width="14" height="14" fill="none"
              stroke="#1A73B8" strokeWidth="1.5" viewBox="0 0 16 16">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 1l5 2v3.5C13 10 11 13 8 14 5 13 3 10 3 6.5V3l5-2z" />
            </svg>
            <p className="text-[12px] text-[#1A73B8] leading-[1.5]">
              Admin access only — contact your manager if you need access.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#42B883] hover:bg-[#2D8A63] disabled:bg-[#A0D9C0] disabled:cursor-not-allowed text-white text-[13px] font-medium py-[10px] rounded-[9px] transition-colors duration-150 active:scale-[0.98] mt-1"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

        </form>

        <p className="text-center text-[11px] text-[#999999] mt-5">
          Subtrack · Subscription management platform
        </p>

      </div>
    </div>
  );
}

export default Login;