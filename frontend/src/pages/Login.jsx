import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRoute, verifyUserRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';
import api from '../utils/AxiosSet';

const Login = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get(verifyUserRoute);
        if (data.authenticated && data.user) {
          if (data.user.isAvatarSet) {
            navigate('/');
          } else {
            navigate('/setAvatar');
          }
        }
      } catch (err) {
        // Not authenticated, stay on login
      }
    };
    verifyUser();
  }, [navigate]);

  // Parallax Effect on Mouse Move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { username, password } = loginData;
    if (!username) {
      toast.error("Username is required!");
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsSubmitting(true);
    try {
      const { username, password } = loginData;
      const { data } = await api.post(loginRoute, { username, password });

      if (!data.status) {
        toast.error(data.message);
        setIsSubmitting(false);
      } else {
        toast.success("Login successful!");
        setTimeout(() => {
          if (data.user.isAvatarSet) {
            navigate('/');
          } else {
            navigate('/setAvatar');
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface font-body-md min-h-screen relative overflow-hidden flex items-center justify-center p-gutter">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-surface-container-low/40 blur-[80px] rounded-full animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[480px]">
        <div 
          ref={cardRef}
          className="glass-card rim-light rounded-[32px] p-container-padding md:p-stack-lg flex flex-col items-center transition-transform duration-200 ease-out"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          {/* Brand Identity */}
          <div className="mb-stack-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container mb-stack-md shadow-[0_8px_30px_rgb(192,193,255,0.3)]">
              <span className="material-symbols-outlined text-on-primary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">VibeChat</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-unit">Welcome back, let's get you connected.</p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-stack-md" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="space-y-unit">
              <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input 
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                  placeholder="Enter your username" 
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-unit">
              <div className="flex justify-between items-center px-unit">
                <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input 
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-title-md text-title-md py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-stack-md my-stack-lg">
            <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
            <span className="font-label-md text-label-md text-outline">OR CONTINUE WITH</span>
            <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
          </div>

          {/* Social Logins */}
          <div className="w-full grid grid-cols-2 gap-stack-md">
            <button className="flex items-center justify-center gap-stack-sm bg-surface-container-high/50 border border-outline-variant/20 py-3 rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95 cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12 5.04c1.9 0 3.53.68 4.7 1.81l3.5-3.5C18.06 1.25 15.26 0 12 0 7.31 0 3.32 2.69 1.41 6.63l4.08 3.16C6.46 7.15 8.99 5.04 12 5.04z" fill="#EA4335"></path>
                <path d="M23.49 12.27c0-.8-.07-1.57-.2-2.32H12v4.39h6.44c-.28 1.48-1.12 2.74-2.38 3.59l3.71 2.87c2.17-2.01 3.42-4.97 3.42-8.53z" fill="#4285F4"></path>
                <path d="M5.49 14.21c-.24-.7-.38-1.45-.38-2.21s.14-1.51.38-2.21L1.41 6.63C.51 8.48 0 10.55 0 12.72s.51 4.24 1.41 6.09l4.08-3.16z" fill="#FBBC05"></path>
                <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.71-2.87c-1.1.74-2.5 1.18-4.24 1.18-3.01 0-5.54-2.11-6.46-4.96l-4.08 3.16C3.32 21.31 7.31 24 12 24z" fill="#34A853"></path>
              </svg>
              <span className="font-label-md text-label-md">Google</span>
            </button>
            <button className="flex items-center justify-center gap-stack-sm bg-surface-container-high/50 border border-outline-variant/20 py-3 rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95 cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.2 0-2.39.6-3.23.6-1.5 0-4.08-2.58-4.08-6.18 0-3.48 2.22-5.34 4.38-5.34.96 0 1.92.54 2.52.54.6 0 1.62-.6 2.76-.6 1.08 0 3.36.36 4.62 2.22-2.76 1.44-2.34 4.86.3 5.94-1.2 1.86-2.58 3.42-4.04 3.42zM12.01 8.28c0-2.28 1.86-4.14 4.14-4.2-.06 2.28-1.92 4.14-4.14 4.2z"></path>
              </svg>
              <span className="font-label-md text-label-md">Apple</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="mt-stack-lg font-body-md text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/30">
              Create Workspace
            </Link>
          </p>
        </div>

        {/* System Status or Footer Notes */}
        <div className="mt-gutter flex justify-center gap-stack-lg">
          <div className="flex items-center gap-unit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[11px] font-label-md text-outline uppercase tracking-widest">Systems Operational</span>
          </div>
          <div className="flex items-center gap-unit">
            <span className="material-symbols-outlined text-[14px] text-outline">language</span>
            <span className="text-[11px] font-label-md text-outline uppercase tracking-widest">English (US)</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;