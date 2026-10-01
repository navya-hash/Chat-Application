import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerRoute, verifyUserRoute } from '../utils/APIRoutes';
import api from '../utils/AxiosSet';

const Signup = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
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
        // Not logged in, stay on signup
      }
    };
    verifyUser();
  }, [navigate]);

  // Card Parallax effect
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
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { username, email, password } = registerData;
    if (!username || username.trim().length < 2) {
      toast.error("Username should be at least 2 characters!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!password || password.length < 8) {
      toast.error("Password should be at least 8 characters!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsSubmitting(true);
    try {
      const { username, email, password } = registerData;
      const { data } = await api.post(registerRoute, { username, email, password });

      if (!data.status) {
        toast.error(data.message);
        setIsSubmitting(false);
      } else {
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate('/setAvatar');
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

      {/* Signup Container */}
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
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Create Workspace</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-unit">Get started with your VibeChat account</p>
          </div>

          {/* Signup Form */}
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="space-y-unit">
              <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input 
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                  placeholder="At least 2 characters" 
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-unit">
              <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input 
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                  placeholder="name@company.com" 
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-unit">
              <label className="font-label-md text-label-md text-on-surface-variant ml-unit">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input 
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                  placeholder="At least 8 characters" 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-stack-lg font-body-md text-body-md text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/30">
              Login
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

export default Signup;