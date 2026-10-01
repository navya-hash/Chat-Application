import React, { useState } from 'react';
import { logoutRoute } from '../utils/APIRoutes';
import api from '../utils/AxiosSet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = ({ className, showText = true, iconOnly = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (e) e.stopPropagation();
    setLoading(true);
    try {
      await api.get(logoutRoute, { withCredentials: true });
      toast.success("Logged out successfully");
    } catch (err) {
      toast.info("Logged out");
    } finally {
      setLoading(false);
      navigate('/login');
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={className || "p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-xl transition-all cursor-pointer flex items-center justify-center"}
        title="Log out"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || "flex items-center gap-2 bg-surface-container-high/50 hover:bg-error/10 border border-outline-variant/20 hover:border-error/30 text-on-surface-variant hover:text-error px-4 py-2 rounded-xl shadow-sm transition-all duration-200 cursor-pointer font-medium text-sm"}
      title="Log out"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      {showText && <span>{loading ? "Logging out..." : "Logout"}</span>}
    </button>
  );
};

export default Logout;
